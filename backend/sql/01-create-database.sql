-- ============================================================
-- Script: Crear base de datos
-- Descripción: Crea la base de datos clientes_db si no existe
-- ============================================================

SELECT 'CREATE DATABASE clientes_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'clientes_db')\gexec

\echo 'Base de datos clientes_db verificada/creada exitosamente'
