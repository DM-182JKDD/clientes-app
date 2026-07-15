import { query, queryOne, execute } from './database';
import { Cliente, CreateClienteDTO } from '../models/cliente.model';

interface ClienteRow {
  codigo_cliente: number;
  nombre_cliente: string;
  direccion_cliente: string;
  telefono_cliente: string;
}

const mapRowToCliente = (row: ClienteRow): Cliente => ({
  codigoCliente: row.codigo_cliente,
  nombreCliente: row.nombre_cliente,
  direccionCliente: row.direccion_cliente,
  telefonoCliente: row.telefono_cliente,
});

export const findAll = async (): Promise<Cliente[]> => {
  const rows = await query<ClienteRow>(
    'SELECT codigo_cliente, nombre_cliente, direccion_cliente, telefono_cliente FROM clientes ORDER BY codigo_cliente'
  );
  return rows.map(mapRowToCliente);
};

export const findByCodigo = async (codigo: number): Promise<Cliente | null> => {
  const row = await queryOne<ClienteRow>(
    'SELECT codigo_cliente, nombre_cliente, direccion_cliente, telefono_cliente FROM clientes WHERE codigo_cliente = $1',
    [codigo]
  );
  return row ? mapRowToCliente(row) : null;
};

export const create = async (cliente: CreateClienteDTO): Promise<Cliente> => {
  const row = await queryOne<ClienteRow>(
    'INSERT INTO clientes (nombre_cliente, direccion_cliente, telefono_cliente) VALUES ($1, $2, $3) RETURNING codigo_cliente, nombre_cliente, direccion_cliente, telefono_cliente',
    [cliente.nombreCliente, cliente.direccionCliente, cliente.telefonoCliente]
  );
  if (!row) {
    throw new Error('Error al crear el cliente');
  }
  return mapRowToCliente(row);
};

export const update = async (
  codigo: number,
  cliente: Partial<CreateClienteDTO>
): Promise<Cliente | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (cliente.nombreCliente !== undefined) {
    fields.push(`nombre_cliente = $${paramIndex++}`);
    values.push(cliente.nombreCliente);
  }
  if (cliente.direccionCliente !== undefined) {
    fields.push(`direccion_cliente = $${paramIndex++}`);
    values.push(cliente.direccionCliente);
  }
  if (cliente.telefonoCliente !== undefined) {
    fields.push(`telefono_cliente = $${paramIndex++}`);
    values.push(cliente.telefonoCliente);
  }

  if (fields.length === 0) {
    return findByCodigo(codigo);
  }

  values.push(codigo);
  const row = await queryOne<ClienteRow>(
    `UPDATE clientes SET ${fields.join(', ')} WHERE codigo_cliente = $${paramIndex} RETURNING codigo_cliente, nombre_cliente, direccion_cliente, telefono_cliente`,
    values
  );
  return row ? mapRowToCliente(row) : null;
};

export const remove = async (codigo: number): Promise<boolean> => {
  const rowCount = await execute(
    'DELETE FROM clientes WHERE codigo_cliente = $1',
    [codigo]
  );
  return rowCount > 0;
};

export const existsByCodigo = async (codigo: number): Promise<boolean> => {
  const row = await queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM clientes WHERE codigo_cliente = $1',
    [codigo]
  );
  return row ? parseInt(String(row.count), 10) > 0 : false;
};
