# Niños a Salvo

Plataforma humanitaria para el **reencuentro familiar** de niños, niñas y adolescentes tras emergencia sísmica en Venezuela. Permite registrar en puntos de resguardo (incluso sin internet), publicar fichas para que las familias los busquen y gestionar entregas seguras con verificación de identidad.

## Características principales

- **Registro offline-first** en campo: datos en IndexedDB (Dexie); sync automática al recuperar señal
- **PWA** instalable con precache de inicio y registro
- **Tablero descriptivo** (sin fotos de menores — LOPNNA): rasgos, edad, ubicación, contacto
- **Búsqueda por nombre** sin exponer identidad en tarjetas ni fichas
- **Cifrado** de datos sensibles con `AUTH_SECRET`
- **Validación** del registro con Zod + react-hook-form

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
| `/` | Landing e instalación PWA | **Sí** |
| `/registro` | Alta de registro (vida o fallecido) | **Sí** (Dexie) |
| `/tablero` | Personas con vida en búsqueda | No |
| `/fallecidos` | Fallecidos en búsqueda | No |
| `/ninos/[id]` | Ficha pública | No |

Sin conexión solo puedes usar inicio y registro. Tablero, fallecidos y fichas requieren internet (la app lo indica al intentar entrar).

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/ninos` | Upsert desde sincronización offline |
| `PATCH` | `/api/ninos/[id]/retiro` | Registrar entrega |

## Documentación

Índice completo en **[docs/README.md](./docs/README.md)**.

### Arquitectura y configuración

- [Arquitectura](./docs/arquitectura.md) — capas, Prisma + Supabase, estructura del código
- [Configuración](./docs/configuracion.md) — variables de entorno, migraciones, bucket Storage
- [Privacidad](./docs/privacidad.md) — qué se guarda, busca y muestra en público

### Flujos

- [PWA e instalación](./docs/flujos/pwa-instalacion.md)
- [Conexión y offline](./docs/flujos/conexion-y-offline.md) — barras UI, rutas offline, navegación bloqueada
- [Registro offline y sincronización](./docs/flujos/registro-y-sincronizacion.md) — Dexie, fotos, sync global
- [Tablero y búsqueda](./docs/flujos/tablero.md)
- [Fallecidos](./docs/flujos/fallecidos.md)
- [Ficha pública](./docs/flujos/ficha-publica.md)
- [Retiro seguro](./docs/flujos/retiro-seguro.md)

## Estructura del proyecto

```
src/
├── app/              # Rutas y API
├── components/
│   ├── ui/           # shadcn
│   ├── layout/       # Header, footer, tema
│   ├── shared/       # Componentes multi-ruta
│   ├── registro/     # /registro
│   ├── tablero/      # /tablero, /fallecidos
│   ├── ninos/        # /ninos/[id]
│   ├── offline/      # PWA offline global
│   └── pwa/          # Instalación
├── types/            # Interfaces y tipos (@/types)
├── hooks/            # Hooks React
├── services/         # Lógica de negocio + Prisma
├── lib/              # Utilidades, Zod, cifrado, sync
└── data/             # Estados y municipios
prisma/               # Schema y migraciones
docs/                 # Documentación
public/               # manifest, sw.js v4, iconos
```

## Scripts útiles

```bash
npm run dev          # Desarrollo (puerto 9002)
npm run build        # Build de producción
npm run db:migrate   # Nueva migración en desarrollo
npm run db:seed      # 100 registros de prueba
npm run db:studio    # Explorador visual de la BD
npm run icons:pwa    # Generar iconos PWA
```

## Privacidad (resumen)

Los niños, niñas y adolescentes **no llevan fotografía** en la plataforma (LOPNNA). El nombre se almacena cifrado para búsqueda interna pero **nunca** aparece en el tablero ni en la ficha pública.

## Licencia

Proyecto privado — uso humanitario.
