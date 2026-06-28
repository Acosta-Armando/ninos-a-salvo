/**
 * Edad en registro:
 * - `edad_estimada` (String): años como entero ("0", "6", "8").
 * - `edad_anios` (Int): mismo valor numérico para filtros; 0 = menor de 1 año (0–12 meses).
 */

export function parseEdadRegistro(
  raw: string,
):
  | { ok: true; edad_estimada: string; edad_anios: number }
  | { ok: false; message: string } {
  const s = raw.trim();
  if (!s) {
    return { ok: false, message: "Ingresa la edad estimada" };
  }
  if (!/^\d+$/.test(s)) {
    return { ok: false, message: "Escribe solo números" };
  }

  const n = Number(s);

  if (n < 0 || n > 120) {
    return { ok: false, message: "Usa un número del 0 al 120" };
  }

  return { ok: true, edad_estimada: s, edad_anios: n };
}

/** Texto legible en tarjetas y fichas (compatible con registros antiguos en meses). */
export function formatEdadEstimada(
  edad_estimada: string,
  edad_anios?: number,
): string {
  const trimmed = edad_estimada.trim();
  if (!trimmed) return edad_estimada;

  if (/[^\d]/.test(trimmed)) return trimmed;

  const n = Number(trimmed);
  if (!Number.isFinite(n)) return trimmed;

  if (edad_anios === 0) {
    if (n === 0) return "Menor de 1 año";
    // Registros antiguos guardados en meses (1–11)
    return n === 1 ? "1 mes" : `${n} meses`;
  }

  const years = edad_anios ?? n;
  if (years === 1) return "1 año";
  return `${years} años`;
}
