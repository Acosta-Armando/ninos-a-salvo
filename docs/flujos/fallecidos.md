# Flujo: Niños fallecidos

**Ruta:** `/fallecidos`  
**Componentes:** mismos que tablero (`TableroPageContent` con `estadoVital="Fallecido"`)

## Diferencia con el tablero

Usa la misma UI y filtros que `/tablero`, pero el servicio filtra:

- `status = Buscando`
- `estado_vital = Fallecido`

## Registro en `/registro`

Al elegir **Fallecido — identificación familiar**:

| Aspecto | Comportamiento |
|---------|----------------|
| Foto | **No** se solicita ni se sube a Storage |
| Mensaje | Aviso respetuoso: no subir fotografías de niños fallecidos |
| Datos del niño | Pregunta «¿Se conocen los datos del niño?» (no el checkbox de «no puede hablar») |
| Rasgos particulares | Siempre obligatorios |
| Nombre | Obligatorio salvo si se marca «No se conocen sus datos» |

Tras guardar con red → redirige a `/fallecidos`. Sin red → `/` (sync pendiente).

## Tarjetas y ficha (sin fotografía)

En listado (`ChildCard`) y ficha (`/ninos/[id]`):

- Se mantiene el **recuadro** de proporción habitual con **fondo negro**.
- Texto **«Sin foto»** en blanco, en diagonal (`SinFotoPlaceholder`).
- **No** se usa favicon ni imagen del niño.
- Se muestran edad, ubicación, resguardo, rasgos (en ficha) y contacto del informante.

## Ficha pública

Al abrir `/ninos/[id]` de un fallecido:

- Misma información pública salvo la foto (área negra con marca «Sin foto»).
- **No** se muestra el formulario de retiro (solo aplica a niños con vida).

## Privacidad

Mismas reglas que el tablero: búsqueda por nombre permitida, nombre nunca visible. Ver [Privacidad](../privacidad.md).
