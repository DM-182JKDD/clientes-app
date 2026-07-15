-- ============================================================
-- Script: Crear tablas
-- Descripción: Crea las tablas necesarias para el sistema
-- ============================================================

-- Eliminar tabla si existe (orden por dependencias)
DROP TABLE IF EXISTS clientes CASCADE;

-- Crear tabla clientes
CREATE TABLE clientes (
    codigo_cliente SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    direccion_cliente VARCHAR(200) NOT NULL,
    telefono_cliente VARCHAR(20) NOT NULL
);

-- Crear índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre_cliente);
CREATE INDEX IF NOT EXISTS idx_clientes_telefono ON clientes(telefono_cliente);

-- Comentarios en la tabla y columnas
COMMENT ON TABLE clientes IS 'Tabla que almacena la información de los clientes';
COMMENT ON COLUMN clientes.codigo_cliente IS 'Código único identificador del cliente (autoincremental)';
COMMENT ON COLUMN clientes.nombre_cliente IS 'Nombre o razón social del cliente';
COMMENT ON COLUMN clientes.direccion_cliente IS 'Dirección fiscal o de contacto del cliente';
COMMENT ON COLUMN clientes.telefono_cliente IS 'Número de teléfono de contacto del cliente';