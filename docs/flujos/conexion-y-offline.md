# Flujo: Conexión, rutas offline y navegación

**Componentes:** `components/offline/*`  
**Layout:** `components/layout/*`  
**Utilidad:** `src/lib/offlineRoutes.ts`  
**Service worker:** `public/sw.js` (v4)

## Rutas disponibles sin internet

Definidas en `OFFLINE_ROUTES` (deben coincidir con `OFFLINE_PATHS` en `sw.js`):

| Ruta | Qué funciona offline |
|------|----------------------|
| `/` | Landing, instalación PWA, enlace a registro |
| `/registro` | Formulario completo + guardado en Dexie |

Todas las demás rutas requieren conexión: `/tablero`, `/fallecidos`, `/ninos/[id]`, APIs.

El service worker precachea `/` y `/registro`. Los chunks `/_next/` usan **red primero** para evitar bundles obsoletos.

## Barra de estado de conexión

`components/offline/ConnectionStatusBar`:

| Evento | Comportamiento |
|--------|----------------|
| Pérdida de red | Barra ámbar permanente |
| Recuperación de red | Barra verde 3 segundos |
| Navegación entre rutas | No reacciona (solo cambios reales de red) |

## Registros pendientes

`components/offline/PendingSyncBar` + hook `usePendingSyncCount`.

## Navegación bloqueada sin conexión

`components/offline/OfflineNavProvider` + `OnlineOnlyButton` / `OnlineOnlyLink`.

Aplica en: landing, pie de página, pestañas tablero/fallecidos, `tablero/ChildCard`, `tablero/Pagination`.

## Precache y sync

- `components/offline/OfflinePrecache`: registra SW y precarga rutas offline.
- `components/offline/SyncProvider`: sincroniza Dexie → API al recuperar red.

Ver [Registro y sincronización](./registro-y-sincronizacion.md).
