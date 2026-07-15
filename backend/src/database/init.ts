import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'clientes_db',
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS clientes (
    codigo_cliente SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    direccion_cliente VARCHAR(200) NOT NULL,
    telefono_cliente VARCHAR(20) NOT NULL
  );
`;

const seedData = async (): Promise<void> => {
  const seedPath = path.join(__dirname, '../../data/clientes.json');
  if (!fs.existsSync(seedPath)) {
    console.log('No seed data file found');
    return;
  }

  const rawData = fs.readFileSync(seedPath, 'utf-8');
  const clientes = JSON.parse(rawData) as Array<{
    codigo_cliente: number;
    nombre_cliente: string;
    direccion_cliente: string;
    telefono_cliente: string;
  }>;

  const client = await pool.connect();
  try {
    for (const cliente of clientes) {
      await client.query(
        `INSERT INTO clientes (codigo_cliente, nombre_cliente, direccion_cliente, telefono_cliente)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (codigo_cliente) DO NOTHING`,
        [
          cliente.codigo_cliente,
          cliente.nombre_cliente,
          cliente.direccion_cliente,
          cliente.telefono_cliente,
        ]
      );
    }
    console.log(`Seeded ${clientes.length} clients`);
  } finally {
    client.release();
  }
};

const initDatabase = async (): Promise<void> => {
  try {
    console.log('Initializing database...');
    await pool.query(createTableQuery);
    console.log('Table created successfully');

    console.log('Seeding data...');
    await seedData();

    console.log('Resetting sequence...');
    await pool.query(
      `SELECT setval('clientes_codigo_cliente_seq', COALESCE((SELECT MAX(codigo_cliente) FROM clientes), 1))`
    );
    console.log('Sequence reset successfully');

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

void initDatabase();
