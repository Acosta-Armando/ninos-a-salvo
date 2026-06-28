# Flujo: Tablero (con vida)

**Ruta:** `/tablero`  
**Componentes:** `components/tablero/*`  
**Servicio:** `listTableroChildren`  
**Tipos:** `types/tablero.ts`

## Criterios de listado

- `status = Buscando`
- `estado_vital = ConVida`

## Búsqueda y filtros

Parámetros URL (`TableroSearchParams` en `types/tablero.ts`):

| Parámetro | Descripción |
|-----------|-------------|
| `q` | Nombre de la persona/familia (tokens cifrados; no visible en UI) |
| `identidad` | `todos` \| `con_nombre` \| `sin_nombre` |
| `estado` | Estado de Venezuela |
| `ciudad` | Municipio |
| `edad` | Rango sobre `edad_anios` |
| `page` | Paginación (20 por página) |

## Tarjeta pública (`tablero/ChildCard`)

- Edad, **rasgos**, ubicación, resguardo, teléfono del informante.
- **Sin fotografías** de menores.
- **No muestra** nombres de la persona registrada ni familiares.

Sin conexión: tarjeta atenuada; diálogo al pulsar.

## Navegación

- Pestañas `TableroNavTabs` → `/tablero` \| `/fallecidos`
- Registrar → `/registro`
- Clic → [Ficha pública](./ficha-publica.md)
