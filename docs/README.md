# Documentación — Niños a Salvo

Índice de la documentación técnica del proyecto.

## General

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura](./arquitectura.md) | Stack, capas, estructura de carpetas |
| [Configuración](./configuracion.md) | Variables de entorno, BD, Storage |
| [Privacidad](./privacidad.md) | Qué se guarda, busca y muestra |

## Flujos de la aplicación

| Flujo | Ruta | Componentes |
|-------|------|-------------|
| PWA | `/` | `components/pwa/*` |
| Offline global | Layout | `components/offline/*` |
| Registro | `/registro` | `components/registro/*` |
| Tablero | `/tablero` | `components/tablero/*` |
| Fallecidos | `/fallecidos` | `components/tablero/*` |
| Ficha | `/ninos/[id]` | `components/shared/*`, `components/ninos/*` |

Documentos detallados en [flujos/](./flujos/).

## API

| Método | Ruta | Uso |
|--------|------|-----|
| `POST` | `/api/ninos` | Upsert desde sync offline |
| `PATCH` | `/api/ninos/[id]/retiro` | Registrar entrega |
| `POST` | `/api/ninos/[id]/retiro/foto` | Subir foto de retiro cifrada |
| `GET` | `/api/media/[...path]` | Servir foto de retiro descifrada |

## Resumen offline

| Ruta | Offline |
|------|---------|
| `/`, `/registro` | Sí |
| `/tablero`, `/fallecidos`, `/ninos/[id]` | No |

## Tipos compartidos

Definidos en `src/types/` — importar con `@/types` o `@/types/child`, etc.
