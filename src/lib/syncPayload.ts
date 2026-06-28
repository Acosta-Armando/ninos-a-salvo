import type { ChildPayload } from "@/types/child";

/** Normaliza fechas guardadas en Dexie (Date o string ISO). */
export function normalizeCreatedAt(value: Date | string | undefined): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return new Date().toISOString();
}

/** Valida y normaliza el payload antes de sincronizar con la API. */
export function buildSyncPayload(child: {
  id: string;
  fullname?: string;
  edad_estimada: string;
  edad_anios: number;
  nombre_padre?: string;
  nombre_madre?: string;
  nombre_familiar_buscado?: string;
  rasgos_particulares?: string;
  estado: string;
  ciudad: string;
  estado_resguardo: string;
  detalles_ubicacion: string;
  informante_nombre: string;
  informante_telefono: string;
  sync_status: string;
  status: ChildPayload["status"];
  estado_vital: ChildPayload["estado_vital"];
  created_at: Date | string;
  manage_token?: string;
}): ChildPayload | { error: string } {
  const rasgos = child.rasgos_particulares?.trim() ?? "";
  const informanteNombre = child.informante_nombre?.trim() ?? "";
  const informanteTelefono = child.informante_telefono?.trim() ?? "";

  if (!rasgos) {
    return { error: "Faltan los rasgos particulares en el registro local." };
  }
  if (!informanteNombre || !informanteTelefono) {
    return { error: "Faltan los datos del informante en el registro local." };
  }
  if (!child.estado?.trim() || !child.ciudad?.trim() || !child.estado_resguardo?.trim()) {
    return { error: "Falta la ubicación en el registro local." };
  }

  const edadAnios = Number(child.edad_anios);
  if (!Number.isFinite(edadAnios)) {
    return { error: "La edad del registro local no es válida." };
  }

  return {
    id: child.id,
    fullname: child.fullname?.trim() || null,
    edad_estimada: String(child.edad_estimada ?? edadAnios),
    edad_anios: edadAnios,
    nombre_padre: child.nombre_padre?.trim() || null,
    nombre_madre: child.nombre_madre?.trim() || null,
    nombre_familiar_buscado: child.nombre_familiar_buscado?.trim() || null,
    rasgos_particulares: rasgos,
    estado: child.estado.trim(),
    ciudad: child.ciudad.trim(),
    estado_resguardo: child.estado_resguardo.trim(),
    detalles_ubicacion: child.detalles_ubicacion?.trim() ?? "",
    informante_nombre: informanteNombre,
    informante_telefono: informanteTelefono,
    status: child.status,
    estado_vital: child.estado_vital,
    created_at: normalizeCreatedAt(child.created_at),
    manage_token: child.manage_token,
  };
}

export async function readApiError(response: Response): Promise<string> {
  const text = await response.text();
  try {
    const data = JSON.parse(text) as { error?: string };
    if (data.error) return data.error;
  } catch {
    // texto plano
  }
  return text || `HTTP ${response.status}`;
}
