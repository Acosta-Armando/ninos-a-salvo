# Flujo: Niños fallecidos

**Ruta:** `/fallecidos`  
**Componentes:** mismos que tablero (`TableroPageContent` con `estadoVital="Fallecido"`)

## Diferencia con el tablero

Usa la misma UI y filtros que `/tablero`, pero el servicio filtra:

- `status = Buscando`
- `estado_vital = Fallecido`

## Registro

Los niños fallecidos se registran en `/registro` eligiendo **Fallecido** como estado vital. Tras guardar, la app redirige a esta lista.

## Ficha pública

Al abrir `/ninos/[id]` de un fallecido:

- Misma información pública (foto, edad, ubicación, informante).
- **No** se muestra el formulario de retiro (solo aplica a niños con vida).

## Privacidad

Mismas reglas que el tablero: búsqueda por nombre permitida, nombre nunca visible. Ver [Privacidad](../privacidad.md).
