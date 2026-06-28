/**
 * Sincronización offline → servidor.
 * Flujo: Dexie (pending) → POST /api/ninos → synced.
 */
import { localDb } from "./db";
import type { ChildPayload, LocalChild } from "@/types/child";

/** Convierte registro local al payload que espera la API. */
function toPayload(child: LocalChild): ChildPayload {
  return {
    id: child.id,
    fullname: child.fullname ?? null,
    edad_estimada: child.edad_estimada,
    edad_anios: child.edad_anios,
    nombre_padre: child.nombre_padre ?? null,
    nombre_madre: child.nombre_madre ?? null,
    nombre_familiar_buscado: child.nombre_familiar_buscado ?? null,
    rasgos_particulares: child.rasgos_particulares ?? null,
    estado: child.estado,
    ciudad: child.ciudad,
    estado_resguardo: child.estado_resguardo,
    detalles_ubicacion: child.detalles_ubicacion,
    informante_nombre: child.informante_nombre,
    informante_telefono: child.informante_telefono,
    status: child.status,
    estado_vital: child.estado_vital,
    created_at: child.created_at.toISOString(),
  };
}

/** Sincroniza un solo registro pending; devuelve false si falla o no hay red. */
async function syncChild(child: LocalChild): Promise<boolean> {
  if (!navigator.onLine) return false;

  const fresh = await localDb.children.get(child.id);
  if (!fresh || fresh.sync_status !== "pending") return false;

  const payload = toPayload(fresh);

  const response = await fetch("/api/ninos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Sync falló para ${fresh.id}:`, error);
    return false;
  }

  await localDb.children.update(fresh.id, {
    sync_status: "synced",
  });

  return true;
}

/** Procesa todos los registros con sync_status = pending. */
export async function syncPendingChildren(): Promise<{
  synced: number;
  failed: number;
}> {
  if (!navigator.onLine) {
    return { synced: 0, failed: 0 };
  }

  const pending = await localDb.children
    .where("sync_status")
    .equals("pending")
    .toArray();

  let synced = 0;
  let failed = 0;

  for (const child of pending) {
    if (!navigator.onLine) break;

    try {
      const ok = await syncChild(child);
      if (ok) synced++;
      else failed++;
    } catch (err) {
      console.error(`Error sincronizando ${child.id}:`, err);
      failed++;
    }
  }

  return { synced, failed };
}

let syncInProgress = false;

/** Dispara sync si hay red y no hay otra en curso. */
export async function triggerSync(): Promise<void> {
  if (syncInProgress || !navigator.onLine) return;
  syncInProgress = true;
  try {
    await syncPendingChildren();
  } finally {
    syncInProgress = false;
  }
}
