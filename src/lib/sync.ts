/**
 * Sincronización offline → servidor.
 * Flujo: Dexie (pending + foto local) → Supabase Storage → POST /api/ninos → synced.
 */
import { resolveChildPhotoBlob } from "./childPhoto";
import { localDb } from "./db";
import { uploadPhoto } from "./supabaseStorage";
import type { ChildPayload, LocalChild } from "./types";

/** Sube la foto del niño si aún está guardada localmente. */
async function uploadChildPhoto(
  child: LocalChild,
): Promise<{ foto_url?: string }> {
  if (!navigator.onLine) return {};

  const blob = resolveChildPhotoBlob(child);
  if (!blob) return {};

  const foto_url = await uploadPhoto(`${child.id}/foto.jpg`, blob);
  return { foto_url };
}

/** Convierte registro local al payload que espera la API. */
function toPayload(
  child: LocalChild,
  urls: { foto_url?: string },
): ChildPayload {
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
    foto_url: urls.foto_url ?? child.foto_url ?? null,
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

  const urls = await uploadChildPhoto(fresh);
  const payload = toPayload(fresh, urls);

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
    foto_url: urls.foto_url ?? fresh.foto_url,
    foto_blob: undefined,
    foto_data: undefined,
    foto_mime: undefined,
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
