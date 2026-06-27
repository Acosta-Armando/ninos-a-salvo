# Privacidad y datos públicos

## Principio

El **nombre del niño y de sus familiares** se guarda para facilitar la búsqueda por parte de quien busca, pero **nunca se muestra** en tarjetas del tablero ni en la ficha pública.

## Qué se guarda vs qué se muestra

| Campo | Se guarda en BD | Búsqueda (`q`) | Tarjeta / ficha pública |
|-------|-----------------|----------------|-------------------------|
| `fullname` | Sí | Sí | **No** |
| `nombre_padre` | Sí | Sí | **No** |
| `nombre_madre` | Sí | Sí | **No** |
| `nombre_familiar_buscado` | Sí | Sí | **No** |
| `foto_url` | Sí (con vida) | No | Sí (con vida); **no** en fallecidos |
| `edad_estimada` | Sí | Filtro por rango | Sí |
| Ubicación (estado, ciudad, resguardo) | Sí | Filtros | Sí |
| `rasgos_particulares` | Sí (obligatorio) | No | Sí (ficha) |
| `informante_nombre` | Sí | No | Sí (ficha) |
| `informante_telefono` | Sí | No | Sí |

## Niños fallecidos

- **No** se suben fotografías del niño (ni en registro ni en Storage).
- En listado y ficha se muestra un recuadro negro con la leyenda «Sin foto», sin imagen identificable.
- El resto de datos (edad, rasgos, ubicación, contacto) ayudan a la identificación familiar con dignidad.

## Implementación técnica

1. **Filtros de búsqueda** (`src/lib/tablero.ts`): el parámetro `q` consulta nombres en servidor.
2. **Selects públicos** (`src/lib/publicChild.ts`): `PUBLIC_CHILD_CARD_SELECT` y `PUBLIC_CHILD_DETAIL_SELECT` excluyen explícitamente campos de identidad del niño.
3. **Servicio** (`getPublicChildById`, `listTableroChildren`): solo devuelven campos de los selects públicos.
4. **UI** (`ChildCard`, `SinFotoPlaceholder`, `RegistroForm`): tratamiento distinto según `estado_vital`.

## Niños sin identificar

Si el rescatista marca **datos desconocidos** (con vida) o **no se conocen sus datos** (fallecido), no se guarda `fullname`. Se muestra un código temporal (`Niño desconocido #XXXX`) solo al quien registra, derivado del UUID.

## Retiro

Cuando un niño es entregado, **sí** se muestran los datos de quien retira (`retiro_fullname`, cédula, parentesco, fotos). Eso forma parte del registro de entrega segura, no de la identidad publicada del niño en búsqueda.

## Filtro «Con nombre / Sin nombre»

Indica si existe nombre registrado internamente. No revela el nombre en la interfaz.
