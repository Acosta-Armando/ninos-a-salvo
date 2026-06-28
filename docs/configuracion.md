# Configuración

## Requisitos

- Node.js 20+
- Proyecto en [Supabase](https://supabase.com) con PostgreSQL habilitado

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Pooler PostgreSQL (puerto **6543**, `?pgbouncer=true`) — runtime de la app |
| `DIRECT_URL` | Conexión directa (puerto **5432**) — migraciones Prisma |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima para Storage desde el navegador |
| `NEXT_PUBLIC_BUCKET_NAME` | Nombre del bucket (ej. `ninos-fotos`) |
| `NEXT_PUBLIC_BUCKET_TYPE` | Tipo de acceso del bucket (normalmente `public`) |
| `AUTH_SECRET` | Cifrado AES-256-GCM de datos sensibles y fotos de retiro |

> Si la contraseña contiene `/` u otros caracteres especiales, codifícalos en la URL (ej. `/` → `%2F`).

### Rutas de fotos de retiro en la base de datos

En PostgreSQL solo se guardan rutas relativas de fotos de **retiro** (adultos), por ejemplo:

`26072e4c-61c1-408e-8350-e98b272b6817/retiro-cedula.jpg`

La URL se sirve vía `/api/media/...` (descifrado con `AUTH_SECRET`).

Aplica a `retiro_foto_cedula_url`, `retiro_foto_persona_url` y `retiro_foto_parentesco_url`.

## Base de datos

```bash
# Aplicar migraciones (producción o tras clonar el repo)
npx prisma migrate deploy

# Desarrollo: crear migración nueva
npm run db:migrate

# Datos de prueba (100 registros sin nombre público)
npm run db:seed

# Explorar datos
npm run db:studio
```

## Bucket de Storage

Crear manualmente en Supabase Dashboard:

1. **Storage → New bucket**
2. Nombre: valor de `NEXT_PUBLIC_BUCKET_NAME` (por defecto `ninos-fotos`)
3. **Public bucket**: activado (las URLs públicas lo requieren)
4. Políticas RLS para rol `anon`:
   - `INSERT` en `ninos-fotos`
   - `SELECT` en `ninos-fotos`
   - `UPDATE` en `ninos-fotos` (necesario por `upsert: true`)

### Rutas de archivos (valor guardado en BD)

| Archivo | Ruta en el bucket |
|---------|-------------------|
| Cédula (retiro) | `{childId}/retiro-cedula.jpg` |
| Persona que retira | `{childId}/retiro-persona.jpg` |
| Documento de parentesco | `{childId}/retiro-parentesco.jpg` |

(Las fotos de retiro se cifran en el servidor; no hay fotos de menores en el bucket.)

## Desarrollo local

```bash
npm install
npm run dev
```

La app corre en **http://localhost:9002** (puerto configurado en `package.json`).

## Producción

```bash
npm run build
npm run start
```

Configura las mismas variables de entorno en el hosting (Vercel, etc.).

## Modo offline (resumen)

- El registro guarda datos en **IndexedDB** (Dexie).
- Las fotos de retiro se suben solo con red, desde el navegador (`src/lib/sync.ts` o formulario de retiro).
- Rutas offline de la PWA: `/` y `/registro` (ver [Conexión y offline](./flujos/conexion-y-offline.md)).

