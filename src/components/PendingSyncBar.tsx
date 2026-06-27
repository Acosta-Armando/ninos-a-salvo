"use client";

import { CloudUpload } from "lucide-react";
import { useIsClient, useOnlineStatus } from "@/hooks/useOnlineStatus";
import { usePendingSyncCount } from "@/hooks/usePendingSyncCount";

/** Aviso superior: registros guardados localmente que aún no se han subido al servidor. */
export function PendingSyncBar() {
  const isClient = useIsClient();
  const online = useOnlineStatus();
  const pendingCount = usePendingSyncCount();

  if (!isClient || online || pendingCount === 0) return null;

  const label =
    pendingCount === 1
      ? "1 registro sin sincronizar"
      : `${pendingCount} registros sin sincronizar`;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full border-b border-amber-700/40 bg-amber-500/95 px-3 py-1.5 text-center text-xs font-medium text-white backdrop-blur-sm"
    >
      <span className="inline-flex items-center justify-center gap-1.5">
        <CloudUpload className="size-3.5 shrink-0" />
        {label} — se enviarán al recuperar internet
      </span>
    </div>
  );
}
