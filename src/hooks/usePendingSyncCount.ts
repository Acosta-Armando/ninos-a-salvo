"use client";
import { liveQuery } from "dexie";
import { useEffect, useState } from "react";
import { localDb } from "@/lib/db";
import { useIsClient } from "@/hooks/useOnlineStatus";

/** Cantidad de registros locales con sync_status = pending. */
export function usePendingSyncCount(): number {
  const isClient = useIsClient();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isClient) return;

    const subscription = liveQuery(() =>
      localDb.children.where("sync_status").equals("pending").count(),
    ).subscribe({
      next: setCount,
      error: (err) => console.error("Error leyendo pendientes de sync:", err),
    });

    return () => subscription.unsubscribe();
  }, [isClient]);

  return count;
}
