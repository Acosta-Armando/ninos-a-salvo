# Niños a Salvo

Plataforma humanitaria para el **reencuentro familiar** de niños tras emergencia sísmica en Venezuela. Permite registrar niños en puntos de resguardo (incluso sin internet), publicar fichas para que las familias los busquen y gestionar entregas seguras con verificación de identidad.

## Características principales

- **Registro offline-first** en campo con sincronización automática al recuperar señal
- **Tablero público** de niños con vida y listado de **fallecidos** para identificación
- **Búsqueda por nombre** sin exponer identidad en tarjetas ni fichas
- **Retiro seguro** con cédula, parentesco y tres fotos obligatorias
- **PWA** instalable desde la página de inicio
- **Tema claro/oscuro**

## Stack

Next.js 16 · React 19 · TypeScript · Prisma 7 · PostgreSQL (Supabase) · Supabase Storage · Dexie · shadcn/ui

## Inicio rápido

```bash
npm install
cp .env.example .env.local   # completa credenciales Supabase
npx prisma migrate deploy
npm run dev
```

Abre **http://localhost:9002**

Guía completa de configuración: [docs/configuracion.md](./docs/configuracion.md)

## Rutas de la aplicación

| Ruta | Descripción | Offline |
|------|-------------|---------|
| `/` | Landing e instalación PWA | No |
| `/registro` | Alta de niño (vida o fallecido) | **Sí** (Dexie + sync) |
| `/tablero` | Niños con vida en búsqueda | No |
| `/fallecidos` | Niños fallecidos en búsqueda | No |
| `/ninos/[id]` | Ficha pública y retiro | No |

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/ninos` | Upsert desde sincronización offline |
| `PATCH` | `/api/ninos/[id]/retiro` | Registrar entrega del niño |

## Documentación

Índice completo en **[docs/README.md](./docs/README.md)**.

### Arquitectura y configuración

- [Arquitectura](./docs/arquitectura.md) — capas, Prisma + Supabase, estructura del código
- [Configuración](./docs/configuracion.md) — variables de entorno, migraciones, bucket Storage
- [Privacidad](./docs/privacidad.md) — qué se guarda, busca y muestra en público

### Flujos

- [PWA e instalación](./docs/flujos/pwa-instalacion.md)
- [Registro offline y sincronización](./docs/flujos/registro-y-sincronizacion.md)
- [Tablero y búsqueda](./docs/flujos/tablero.md)
- [Fallecidos](./docs/flujos/fallecidos.md)
- [Ficha pública del niño](./docs/flujos/ficha-publica.md)
- [Retiro seguro](./docs/flujos/retiro-seguro.md)

## Estructura del proyecto

```
src/
├── app/           # Rutas y API
├── components/    # UI
├── services/      # Lógica de negocio y acceso Prisma
├── lib/           # Cliente DB, sync, storage, filtros
└── data/          # Estados y municipios de Venezuela
prisma/            # Schema y migraciones
docs/              # Documentación detallada
public/            # manifest.json, service worker
```

## Scripts útiles

```bash
npm run dev          # Desarrollo (puerto 9002)
npm run build        # Build de producción
npm run db:migrate   # Nueva migración en desarrollo
npm run db:seed      # 100 registros de prueba
npm run db:studio    # Explorador visual de la BD
```

## Privacidad (resumen)

El nombre del niño y de sus familiares se almacena para **filtrar en el buscador**, pero **nunca** aparece en el tablero ni en la ficha pública. Detalle en [docs/privacidad.md](./docs/privacidad.md).

## Licencia

Proyecto privado — uso humanitario.
