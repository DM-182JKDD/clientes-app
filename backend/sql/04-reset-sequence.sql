-- ============================================================
-- Script: Reiniciar secuencia
-- Descripción: Sincroniza la secuencia SERIAL con el máximo
--              codigo_cliente existente en la tabla.
--              Ejecutar después de inserts con ID explícito.
-- ============================================================

SELECT setval('clientes_codigo_cliente_seq', COALESCE((SELECT MAX(codigo_cliente) FROM clientes), 1));

\echo 'Secuencia clientes_codigo_cliente_seq reiniciada'
