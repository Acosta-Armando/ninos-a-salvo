# Flujo: Fallecidos

**Ruta:** `/fallecidos`  
**Componentes:** `components/tablero/TableroPageContent` con `estadoVital="Fallecido"`

## Diferencia con el tablero

Misma UI y filtros que `/tablero`, con `estado_vital = Fallecido`.

## Registro en `/registro`

Al elegir **Fallecido — identificación familiar**:

| Aspecto | Comportamiento |
|---------|----------------|
| Fotos | **No** se solicitan (LOPNNA) |
| Rasgos | Obligatorios |
| Nombre | Obligatorio salvo «No se conocen sus datos» |

Componente: `components/registro/RegistroForm.tsx`.

## Tarjetas y ficha

- Edad, rasgos (en ficha), ubicación, contacto.
- Etiqueta «Identificación familiar» en tarjeta.
- Sin fotografías de menores.

## Ficha pública

`/ninos/[id]`: sin formulario de retiro.
