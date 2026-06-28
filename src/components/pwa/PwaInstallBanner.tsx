"use client";
import { Smartphone } from "lucide-react";
import { PwaInstallButton } from "@/components/pwa/PwaInstallButton";
import { usePwaInstall } from "@/components/pwa/PwaInstallProvider";

/** Bloque del footer: siempre visible. Instala la PWA o abre la app si ya está instalada. */
export function PwaInstallBanner() {
  const { installed, ready } = usePwaInstall();

  return (
    <section className="rounded-xl border bg-card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Smartphone className="size-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold">
              {ready && installed
                ? "App en tu dispositivo"
                : "Instala la app en tu dispositivo"}
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              {ready && installed
                ? "La app está instalada. Ábrela para registrar en campo, incluso con poca señal."
                : "Acceso rápido desde la pantalla de inicio. Ideal para registrar en campo cuando la conexión es limitada."}
            </p>
          </div>
        </div>
        <PwaInstallButton />
      </div>
    </section>
  );
}
