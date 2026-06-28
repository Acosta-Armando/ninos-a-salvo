# Privacidad y datos públicos

## Principio

El **nombre de la persona registrada y de sus familiares** se guarda (cifrado) para facilitar la búsqueda, pero **nunca se muestra** en tarjetas del tablero ni en la ficha pública.

Por **LOPNNA**, **no se publican fotografías** de menores en la plataforma.

## Qué se guarda vs qué se muestra

| Campo | Se guarda en BD | Búsqueda (`q`) | Tarjeta / ficha pública |
|-------|-----------------|----------------|-------------------------|
| `fullname` | Sí (cifrado) | Sí (tokens) | **No** |
| `nombre_padre` | Sí (cifrado) | Sí (tokens) | **No** |
| `nombre_madre` | Sí (cifrado) | Sí (tokens) | **No** |
| `nombre_familiar_buscado` | Sí (cifrado) | Sí (tokens) | **No** |
| Fotos de menores | **No** | — | **No** |
| `edad_estimada` | Sí | Filtro por rango | Sí |
| `rasgos_particulares` | Sí (cifrado) | No | Sí |
| Ubicación | Sí (parcialmente cifrado) | Filtros | Sí |
| `informante_nombre` | Sí (cifrado) | No | Sí (ficha) |
| `informante_telefono` | Sí (cifrado) | No | Sí |

## Implementación técnica

1. **Búsqueda** (`lib/tablero.ts` + `identity_search_tokens`).
2. **Selects públicos** (`lib/publicChild.ts`); tipos en `types/public-child.ts`.
3. **Cifrado** (`lib/crypto.ts`, `lib/childCrypto.ts`, `AUTH_SECRET`).
4. **UI** (`components/tablero/ChildCard`, `components/registro/RegistroForm`).

## Retiro

Campos `retiro_*` y fotos de adultos se conservan en BD para entrega segura futura; no forman parte de la ficha pública en búsqueda.
