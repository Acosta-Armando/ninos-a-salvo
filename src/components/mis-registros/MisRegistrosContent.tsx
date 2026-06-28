"use client";
import Link from "next/link";
import { CloudUpload, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ReencontradoConfirmDialog } from "@/components/mis-registros/ReencontradoConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { localDb } from "@/lib/db";
import { getDisplayName } from "@/lib/displayName";
import { formatEdadEstimada } from "@/lib/edad";
import { triggerSync } from "@/lib/sync";
import type { LocalChild } from "@/types/child";
import type { ChildStatusSnapshot } from "@/types/mis-registros";

function statusLabel(child: LocalChild): string {
  if (child.status === "Reencontrado") {
    if (child.close_status === "pending") return "Cierre pendiente de subir";
    return "Fuera del tablero";
  }
  if (child.sync_status === "pending") return "Pendiente de subir";
  if (child.estado_vital === "Fallecido") return "En lista de fallecidos";
  return "En tablero";
}

function canMarkReencontrado(child: LocalChild): boolean {
  return (
    child.estado_vital === "ConVida" &&
    child.status === "Buscando" &&
    Boolean(child.manage_token)
  );
}

export function MisRegistrosContent() {
  const online = useOnlineStatus();
  const [records, setRecords] = useState<LocalChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = useCallback(async () => {
    const rows = await localDb.children.orderBy("created_at").reverse().toArray();

    if (online && rows.length > 0) {
      try {
        const res = await fetch("/api/ninos/estado", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: rows.map((r) => r.id) }),
        });
        if (res.ok) {
          const data = (await res.json()) as { children: ChildStatusSnapshot[] };
          const remote = new Map(data.children.map((c) => [c.id, c]));
          for (const row of rows) {
            const snap = remote.get(row.id);
            if (!snap) continue;
            if (snap.status !== row.status) {
              await localDb.children.update(row.id, { status: snap.status });
              row.status = snap.status;
              if (snap.status === "Reencontrado" && row.close_status === "pending") {
                await localDb.children.update(row.id, { close_status: "synced" });
                row.close_status = "synced";
              }
            }
          }
        }
      } catch {
        // Lista local sigue usable sin refresco remoto.
      }
    }

    setRecords(rows);
    setLoading(false);
  }, [online]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const handleConfirm = async () => {
    if (!selectedId) return;
    setSaving(true);
    setError(null);

    const child = await localDb.children.get(selectedId);
    if (!child?.manage_token) {
      setError("Este registro no se puede cerrar desde este dispositivo.");
      setSaving(false);
      setSelectedId(null);
      return;
    }

    await localDb.children.update(selectedId, {
      status: "Reencontrado",
      close_status: "pending",
    });

    if (online) {
      await triggerSync();
      await loadRecords();
    } else {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === selectedId
            ? { ...r, status: "Reencontrado", close_status: "pending" }
            : r,
        ),
      );
    }

    setSaving(false);
    setSelectedId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" aria-hidden />
        <span className="sr-only">Cargando registros</span>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-4 py-8 text-center text-sm text-muted-foreground">
          <p>No hay registros creados en este dispositivo.</p>
          <Button asChild>
            <Link href="/registro">Crear un registro</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Solo ves los registros hechos desde este celular o navegador. Si
          registraste en otro dispositivo, no aparecerán aquí.
        </p>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <ul className="space-y-3">
          {records.map((child) => (
            <li key={child.id}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {getDisplayName(child.fullname, child.id)}
                    </CardTitle>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                      {statusLabel(child)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    {formatEdadEstimada(child.edad_estimada, child.edad_anios)}
                    {" · "}
                    {child.ciudad}, {child.estado}
                  </p>
                  <p>{child.estado_resguardo}</p>
                  {child.sync_status === "pending" ? (
                    <p className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300">
                      <CloudUpload className="size-3.5" aria-hidden />
                      Aún no se ha subido al servidor
                    </p>
                  ) : null}
                  {canMarkReencontrado(child) ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setSelectedId(child.id)}
                    >
                      Ya no está en mi resguardo
                    </Button>
                  ) : null}
                  {!child.manage_token && child.status === "Buscando" ? (
                    <p className="text-xs text-muted-foreground">
                      Este registro antiguo no puede cerrarse desde aquí.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <ReencontradoConfirmDialog
        open={selectedId !== null}
        loading={saving}
        onCancel={() => setSelectedId(null)}
        onConfirm={() => void handleConfirm()}
      />
    </>
  );
}
