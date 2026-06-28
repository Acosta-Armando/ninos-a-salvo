"use client";
import { Smartphone } from "lucide-react";
import { PwaInstallButton } from "@/components/pwa/PwaInstallButton";
import { usePwaInstall } from "@/components/pwa/PwaInstallProvider";

/** Bloque en la home: instalar la PWA para usar registro offline en campo. */
export function PwaInstallBanner() {
  const { installed, ready } = usePwaInstall();

  if (!ready || installed) return null;

  return (
    <section
      className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-left sm:p-5"
      aria-label="Instalar la aplicación"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Smartphone className="size-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold">Instala la app en tu dispositivo</h2>
            <p className="text-sm text-muted-foreground">
              Para registrar sin conexión necesitas instalarla en tu celular o
              tablet. Podrás hacer registros en campo y, al volver a tener señal,
              se subirán automáticamente a la red.
            </p>
          </div>
        </div>
        <PwaInstallButton />
      </div>
    </section>
  );
}
