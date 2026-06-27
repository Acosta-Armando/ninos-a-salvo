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

> Si la contraseña contiene `/` u otros caracteres especiales, codifícalos en la URL (ej. `/` → `%2F`).

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
2. Nombre: `ninos-fotos`
3. **Public bucket**: activado (las URLs públicas lo requieren)
4. Políticas RLS para rol `anon`:
   - `INSERT` en `ninos-fotos`
   - `SELECT` en `ninos-fotos`
   - `UPDATE` en `ninos-fotos` (necesario por `upsert: true`)

### Rutas de archivos

| Archivo | Ruta en el bucket |
|---------|-------------------|
| Foto del niño (registro) | `{childId}/foto.jpg` |
| Cédula (retiro) | `{childId}/retiro-cedula.jpg` |
| Persona que retira | `{childId}/retiro-persona.jpg` |
| Documento de parentesco | `{childId}/retiro-parentesco.jpg` |

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
