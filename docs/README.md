# Documentación — Niños a Salvo

Índice de la documentación técnica del proyecto.

## General

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura](./arquitectura.md) | Stack, capas y cómo interactúan Prisma, Supabase y Dexie |
| [Configuración](./configuracion.md) | Variables de entorno, base de datos, bucket y despliegue |
| [Privacidad](./privacidad.md) | Qué datos se guardan, buscan y muestran en público |

## Flujos de la aplicación

| Flujo | Ruta principal | Documento |
|-------|----------------|-------------|
| Inicio e instalación PWA | `/` | [PWA](./flujos/pwa-instalacion.md) |
| Registro offline de un niño | `/registro` | [Registro y sincronización](./flujos/registro-y-sincronizacion.md) |
| Tablero (niños con vida) | `/tablero` | [Tablero y búsqueda](./flujos/tablero.md) |
| Registro de fallecidos | `/fallecidos` | [Fallecidos](./flujos/fallecidos.md) |
| Ficha pública del niño | `/ninos/[id]` | [Ficha pública](./flujos/ficha-publica.md) |
| Retiro seguro | `/ninos/[id]` | [Retiro](./flujos/retiro-seguro.md) |

## API

| Método | Ruta | Uso |
|--------|------|-----|
| `POST` | `/api/ninos` | Upsert desde sincronización offline |
| `PATCH` | `/api/ninos/[id]/retiro` | Registrar entrega del niño a su familia |
