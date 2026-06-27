# Flujo: Ficha pública del niño

**Ruta:** `/ninos/[id]`  
**Servicio:** `getPublicChildById`

## Acceso

Desde una tarjeta del tablero o fallecidos. Requiere conexión (datos en servidor).

## Información mostrada

| Sección | Contenido |
|---------|-----------|
| Foto | Imagen del niño |
| Edad | `edad_estimada` |
| Rasgos | `rasgos_particulares` (si existe) |
| Ubicación | Estado, municipio, punto de resguardo, descripción |
| Contacto | Nombre y teléfono del informante (botón llamar) |

## Si ya fue entregado (`Reencontrado`)

Banner verde con datos de quien retiró y las tres fotos del retiro. Ver [Retiro seguro](./retiro-seguro.md).

## Si es fallecido

Sin formulario de retiro. Botón volver → `/fallecidos`.

## Si está en búsqueda y con vida

Muestra la ficha + formulario **Registrar retiro** al final.

## Datos excluidos

`getPublicChildById` usa `PUBLIC_CHILD_DETAIL_SELECT`: no devuelve `fullname`, `nombre_padre`, `nombre_madre` ni `nombre_familiar_buscado`.
