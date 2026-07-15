# Clientes App - Administración de Clientes

Aplicación Full Stack para la gestión y administración de clientes, desarrollada con Angular y Node.js/Express.

## Tecnologías

### Backend
- Node.js
- Express
- TypeScript (Strict Mode)
- PostgreSQL
- Arquitectura MVC

### Frontend
- Angular (Última versión estable)
- TypeScript
- Standalone Components
- Reactive Forms
- CSS Moderno

## Prerrequisitos

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14.0.0

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd clientes-app
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` con los datos de conexión a PostgreSQL:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=clientes_db
```

### 3. Crear la base de datos

Conectar a PostgreSQL y ejecutar:

```sql
SELECT 'CREATE DATABASE clientes_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'clientes_db')\gexec
\echo 'Base de datos clientes_db verificada/creada exitosamente'
```

```sql
DROP TABLE IF EXISTS clientes CASCADE;
CREATE TABLE clientes (
    codigo_cliente SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    direccion_cliente VARCHAR(200) NOT NULL,
    telefono_cliente VARCHAR(20) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre_cliente);
CREATE INDEX IF NOT EXISTS idx_clientes_telefono ON clientes(telefono_cliente);
COMMENT ON TABLE clientes IS 'Tabla que almacena la información de los clientes';
COMMENT ON COLUMN clientes.codigo_cliente IS 'Código único identificador del cliente (autoincremental)';
COMMENT ON COLUMN clientes.nombre_cliente IS 'Nombre o razón social del cliente';
COMMENT ON COLUMN clientes.direccion_cliente IS 'Dirección fiscal o de contacto del cliente';
COMMENT ON COLUMN clientes.telefono_cliente IS 'Número de teléfono de contacto del cliente';
```

```sql
INSERT INTO clientes (codigo_cliente, nombre_cliente, direccion_cliente, telefono_cliente)
VALUES
  (1, 'Empresa ABC S.A.',         'Calle Principal 123, Ciudad de México',     '+52 55 1234 5678'),
  (2, 'Distribuidora XYZ',         'Av. Reforma 456, Guadalajara',              '+52 33 8765 4321'),
  (3, 'Comercializadora Delta',    'Blvd. Industria 789, Monterrey',            '+52 81 5555 1234'),
  (4, 'Tecnología Avanzada S.A. de C.V.', 'Calle Innovación 321, Querétaro',   '+52 442 987 6543'),
  (5, 'Servicios Profesionales Lambda',   'Av. Universidad 654, Puebla',        '+52 222 345 6789')
ON CONFLICT (codigo_cliente) DO NOTHING;
SELECT setval('clientes_codigo_cliente_seq', COALESCE((SELECT MAX(codigo_cliente) FROM clientes), 1));

\echo 'Datos iniciales insertados y secuencia sincronizada'
```

### 4. Instalar dependencias

```bash
pnpm install
```

### 5. Inicializar la base de datos

```bash
pnpm --filter backend db:init
```

## Ejecución

Para iniciar el proyecto completo (backend y frontend):

```bash
pnpm dev
```

Esto iniciará:
- Backend en http://localhost:3000
- Frontend en http://localhost:4200

## Estructura del Proyecto

```
clientes-app/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Lógica de negocio y respuestas HTTP
│   │   ├── models/         # Interfaces, DTOs y modelos
│   │   ├── persistence/    # Acceso a PostgreSQL
│   │   ├── routes/         # Definición de endpoints
│   │   └── app.ts          # Configuración principal de Express
│   ├── data/
│   │   └── clientes.json   # Datos de ejemplo
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── cliente-form/
│   │   │   └── cliente-list/
│   │   ├── models/
│   │   ├── services/
│   │   ├── app.component.ts
│   │   └── main.ts
│   └── package.json
├── package.json
├── pnpm-workspace.yaml
├── .env.example
└── README.md
```

## API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /clientes | Obtener todos los clientes |
| GET | /clientes/:codigo | Obtener cliente por código |
| POST | /clientes | Crear nuevo cliente |
| PUT | /clientes/:codigo | Actualizar cliente |
| DELETE | /clientes/:codigo | Eliminar cliente |

## Modelo de Datos

### Cliente

| Campo | Tipo | Descripción |
|-------|------|-------------|
| codigo_cliente | INTEGER | Código único del cliente (PK) |
| nombre_cliente | VARCHAR(100) | Nombre del cliente |
| direccion_cliente | VARCHAR(200) | Dirección del cliente |
| telefono_cliente | VARCHAR(20) | Teléfono del cliente |

## Desarrollo

### Backend

```bash
pnpm --filter backend dev
```

### Frontend

```bash
pnpm --filter frontend start
```
