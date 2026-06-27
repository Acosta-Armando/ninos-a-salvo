# Flujo: Ficha pública del niño

**Ruta:** `/ninos/[id]`  
**Servicio:** `getPublicChildById`

## Acceso

Desde una tarjeta del tablero o fallecidos. Requiere conexión (datos en servidor). Sin red, los enlaces están deshabilitados con aviso (ver [Conexión y offline](./conexion-y-offline.md)).

## Información mostrada

| Sección | Con vida | Fallecido |
|---------|----------|-----------|
| Foto | Imagen del niño (o favicon si falta URL) | Recuadro negro con texto «Sin foto» en diagonal |
| Edad | `edad_estimada` | Igual |
| Rasgos | `rasgos_particulares` (obligatorio al registrar) | Igual |
| Ubicación | Estado, municipio, resguardo, descripción | Igual |
| Contacto | Informante + botón llamar | Igual |

## Si ya fue entregado (`Reencontrado`)

Banner verde con datos de quien retiró y las tres fotos del retiro. Ver [Retiro seguro](./retiro-seguro.md).

## Si es fallecido

- Sin formulario de retiro.
- Botón volver → `/fallecidos`.
- Sin fotografía del niño en la UI pública.

## Si está en búsqueda y con vida

La ficha muestra los datos anteriores. El componente `RetiroForm` existe en el proyecto para el flujo de retiro; su visibilidad en la página depende de la implementación actual en `ninos/[id]/page.tsx`.

## Datos excluidos

`getPublicChildById` usa `PUBLIC_CHILD_DETAIL_SELECT`: no devuelve `fullname`, `nombre_padre`, `nombre_madre` ni `nombre_familiar_buscado`.
