# Flujo: Tablero de niños con vida

**Ruta:** `/tablero`  
**Componentes:** `TableroPageContent`, `TableroFilters`, `TableroNavTabs`, `ChildCard`, `Pagination`  
**Servicio:** `listTableroChildren`

## Criterios de listado

Solo aparecen niños con:

- `status = Buscando`
- `estado_vital = ConVida`

Los ya entregados (`Reencontrado`) dejan de mostrarse aquí.

## Búsqueda y filtros

Parámetros URL (`TableroSearchParams`):

| Parámetro | Descripción |
|-----------|-------------|
| `q` | Nombre del niño, padre, madre o familiar buscado (no se muestra en resultados) |
| `identidad` | `todos` \| `con_nombre` \| `sin_nombre` |
| `estado` | Estado de Venezuela |
| `ciudad` | Municipio |
| `edad` | Rango: `0-2`, `3-5`, `6-8`, `8-10`, `10+` |
| `page` | Paginación (20 por página) |

```mermaid
flowchart LR
  U[Familia / voluntario] --> F[Filtros en URL]
  F --> S[listTableroChildren]
  S --> W[buildTableroWhere]
  W --> DB[(PostgreSQL)]
  DB --> C[ChildCard sin nombre]
  C --> L[/ninos/id]
```

## Tarjeta pública (`ChildCard`)

**Niños con vida** (`esFallecido={false}`):

- Foto, edad estimada, ubicación, resguardo, descripción breve, teléfono del informante.

**No muestra:** nombre del niño ni de familiares.

Sin conexión: la tarjeta se ve atenuada; al pulsar, diálogo pidiendo reconectar (no navega a la ficha).

## Navegación relacionada

- Pestañas **Con vida** / **Fallecidos** (`TableroNavTabs`) — deshabilitadas offline hacia la otra lista si no hay red.
- **Registrar niño** → `/registro` (disponible offline).
- Clic en tarjeta → [Ficha pública](./ficha-publica.md) (requiere conexión).

Ver también [Fallecidos](./fallecidos.md) para tarjetas sin fotografía.
