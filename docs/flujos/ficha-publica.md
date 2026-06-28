# Flujo: Ficha pública

**Ruta:** `/ninos/[id]`  
**Componentes:** `components/shared/EntregaSeguraNotice`, `components/layout/AppHeader`  
**Servicio:** `getPublicChildById`

## Acceso

Desde una tarjeta del tablero o fallecidos. Requiere conexión.

## Información mostrada

| Sección | Contenido |
|---------|-----------|
| Descripción | Edad + rasgos particulares |
| Aviso LOPNNA | Sin fotografías de menores en internet |
| Ubicación | Estado, municipio, resguardo, descripción |
| Contacto | Informante + botón llamar |
| Entrega segura | `EntregaSeguraNotice` (con vida en búsqueda) |

## Si ya fue entregado (`Reencontrado`)

Banner verde con datos de quien retiró. Ver [Retiro seguro](./retiro-seguro.md).

## Datos excluidos

`PUBLIC_CHILD_DETAIL_SELECT` en `lib/publicChild.ts`: no devuelve nombres de la persona registrada ni familiares.

Tipos: `types/public-child.ts`.
