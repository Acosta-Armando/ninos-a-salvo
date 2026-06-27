# Flujo: Conexión, rutas offline y navegación

**Componentes:** `ConnectionStatusBar`, `PendingSyncBar`, `OfflineNavProvider`, `OnlineOnlyNav`, `OfflinePrecache`  
**Utilidad:** `src/lib/offlineRoutes.ts`  
**Service worker:** `public/sw.js` (v3)

## Rutas disponibles sin internet

Definidas en `OFFLINE_ROUTES` (deben coincidir con `OFFLINE_PATHS` en `sw.js`):

| Ruta | Qué funciona offline |
|------|----------------------|
| `/` | Landing, instalación PWA, enlace a registro |
| `/registro` | Formulario completo + guardado en Dexie |

Todas las demás rutas requieren conexión: `/tablero`, `/fallecidos`, `/ninos/[id]`, APIs.

El service worker precachea `/`, `/registro`, assets estáticos y hace fallback por pathname para esas rutas.

## Barra de estado de conexión

`ConnectionStatusBar` (parte superior, sticky):

| Evento | Comportamiento |
|--------|----------------|
| Pérdida de red (`offline`) | Barra ámbar permanente: «Sin conexión — modo offline» |
| Recuperación de red (`online`) | Barra verde 3 segundos: «Con conexión — modo en línea» |
| Navegación entre rutas | **No** muestra la barra (solo reacciona a cambios reales de red) |

## Registros pendientes de sincronizar

`PendingSyncBar` aparece **debajo** de la barra de conexión cuando:

- No hay internet, **y**
- Existe al menos un registro en Dexie con `sync_status = pending`

Muestra el contador (p. ej. «2 registros sin sincronizar — se enviarán al recuperar internet»). Usa `usePendingSyncCount` con `liveQuery` de Dexie.

## Navegación bloqueada sin conexión

`OfflineNavProvider` + `OnlineOnlyButton` / `OnlineOnlyLink`:

- Enlaces y botones hacia rutas que requieren servidor se ven atenuados sin red.
- Al pulsarlos, un diálogo indica que hay que reconectar internet.
- Rutas `/` y `/registro` siguen accesibles.

Aplica en: landing, pie de página, pestañas tablero/fallecidos, tarjetas `ChildCard`, paginación.

## Precache en cliente

`OfflinePrecache` (en `layout.tsx`): al iniciar con red, registra el SW y precarga rutas offline para que `/registro` abra sin depender de la primera visita con conexión.

## Sincronización global

`SyncProvider` está en el **layout raíz** (no solo en `/registro`). Al evento `online` y al montar la app con red, ejecuta `triggerSync()` para subir fotos pendientes y enviar registros a la API.

Ver detalle del registro en [Registro y sincronización](./registro-y-sincronizacion.md).
