-- ============================================================
-- Script: Datos iniciales (seed)
-- Descripción: Inserta clientes de ejemplo
-- ============================================================

INSERT INTO clientes (codigo_cliente, nombre_cliente, direccion_cliente, telefono_cliente)
VALUES
  (1, 'Empresa ABC S.A.',         'Calle Principal 123, Ciudad de México',     '+52 55 1234 5678'),
  (2, 'Distribuidora XYZ',         'Av. Reforma 456, Guadalajara',              '+52 33 8765 4321'),
  (3, 'Comercializadora Delta',    'Blvd. Industria 789, Monterrey',            '+52 81 5555 1234'),
  (4, 'Tecnología Avanzada S.A. de C.V.', 'Calle Innovación 321, Querétaro',   '+52 442 987 6543'),
  (5, 'Servicios Profesionales Lambda',   'Av. Universidad 654, Puebla',        '+52 222 345 6789')
ON CONFLICT (codigo_cliente) DO NOTHING;

-- Sincronizar la secuencia SERIAL con el máximo valor insertado
SELECT setval('clientes_codigo_cliente_seq', COALESCE((SELECT MAX(codigo_cliente) FROM clientes), 1));

\echo 'Datos iniciales insertados y secuencia sincronizada'
