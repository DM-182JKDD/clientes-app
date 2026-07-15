import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'clientes_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async <T>(
  text: string,
  params?: unknown[]
): Promise<T[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
};

export const queryOne = async <T>(
  text: string,
  params?: unknown[]
): Promise<T | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return (result.rows[0] as T) || null;
  } finally {
    client.release();
  }
};

export const execute = async (
  text: string,
  params?: unknown[]
): Promise<number> => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rowCount || 0;
  } finally {
    client.release();
  }
};

export const getClient = () => pool.connect();

export default pool;
