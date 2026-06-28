# Flujo: Retiro seguro

**Ruta:** `/ninos/[id]` (solo `ConVida` y `Buscando`)  
**Componente:** `RetiroForm`  
**API:** `PATCH /api/ninos/[id]/retiro`  
**Servicio:** `registerChildRetiro`

## Objetivo

Registrar la entrega a un familiar o tutor legítimo y **bloquear** el registro para evitar entregas fraudulentas.

## Requisitos

### Datos de texto

- Cédula de quien retira
- Nombre completo
- Parentesco
- Teléfono

### Tres fotos obligatorias

1. **Cédula** — documento legible
2. **Persona** — rostro de quien retira
3. **Parentesco** — acta, partida u otro documento que acredite el vínculo

## Secuencia

```mermaid
sequenceDiagram
  participant U as Familiar
  participant R as RetiroForm
  participant ST as Supabase Storage
  participant API as PATCH retiro
  participant S as registerChildRetiro
  participant DB as PostgreSQL

  U->>R: Datos + 3 fotos
  R->>ST: retiro-cedula.jpg, retiro-persona.jpg, retiro-parentesco.jpg
  ST-->>R: URLs públicas
  R->>API: RetiroPayload
  API->>S: Validar + actualizar
  S->>DB: status=Reencontrado
  DB-->>U: Ficha actualizada (sin nuevo retiro)
```

## Validaciones del servicio

| Error | HTTP | Condición |
|-------|------|-----------|
| `InvalidRetiroPayloadError` | 400 | Campo vacío |
| `ChildNotFoundError` | 404 | ID inexistente |
| `ChildAlreadyDeliveredError` | 409 | Ya `Reencontrado` |

## Tras el retiro

- El registro **desaparece** del tablero (`status` ya no es `Buscando`).
- La ficha muestra el bloque «Reencuentro familiar» con auditoría del retiro.
- No se puede volver a registrar retiro.

## Offline

Este flujo **no** funciona sin internet: las fotos se suben directamente desde el navegador a Storage.
