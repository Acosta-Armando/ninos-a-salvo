/**
 * Sincronización offline → servidor.
 * Flujo: Dexie (pending) → POST /api/ninos → synced.
 * Cierres: Dexie (close_status pending) → PATCH reencontrado → synced.
 */
import { localDb } from "./db";
import { buildSyncPayload, readApiError } from "./syncPayload";
import type { LocalChild } from "@/types/child";

/** Sincroniza un solo registro pending; devuelve false si falla o no hay red. */
async function syncChild(child: LocalChild): Promise<boolean> {
  if (!navigator.onLine) return false;

  const fresh = await localDb.children.get(child.id);
  if (!fresh || fresh.sync_status !== "pending") return false;

  const payload = buildSyncPayload(fresh);
  if ("error" in payload) {
    console.error(`Sync inválido para ${fresh.id}:`, payload.error);
    return false;
  }

  const response = await fetch("/api/ninos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await readApiError(response);
    console.error(`Sync falló para ${fresh.id}:`, error);
    return false;
  }

  await localDb.children.update(fresh.id, {
    sync_status: "synced",
    ...(fresh.status === "Reencontrado" && fresh.close_status === "pending"
      ? { close_status: "synced" as const }
      : {}),
  });

  return true;
}

async function syncClose(child: LocalChild): Promise<boolean> {
  if (!navigator.onLine) return false;

  const fresh = await localDb.children.get(child.id);
  if (
    !fresh ||
    fresh.close_status !== "pending" ||
    fresh.status !== "Reencontrado" ||
    !fresh.manage_token
  ) {
    return false;
  }

  if (fresh.sync_status === "pending") {
    const created = await syncChild(fresh);
    if (!created) return false;
  }

  const response = await fetch(`/api/ninos/${fresh.id}/reencontrado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ manage_token: fresh.manage_token }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      await localDb.children.update(fresh.id, { close_status: "synced" });
      return true;
    }
    const error = await readApiError(response);
    console.error(`Cierre falló para ${fresh.id}:`, error);
    return false;
  }

  await localDb.children.update(fresh.id, {
    close_status: "synced",
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

async function syncPendingCloses(): Promise<{
  synced: number;
  failed: number;
}> {
  if (!navigator.onLine) {
    return { synced: 0, failed: 0 };
  }

  const pendingClose = await localDb.children
    .where("close_status")
    .equals("pending")
    .toArray();

  let synced = 0;
  let failed = 0;

  for (const child of pendingClose) {
    if (!navigator.onLine) break;

    try {
      const ok = await syncClose(child);
      if (ok) synced++;
      else failed++;
    } catch (err) {
      console.error(`Error cerrando ${child.id}:`, err);
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
    await syncPendingCloses();
  } finally {
    syncInProgress = false;
  }
}
