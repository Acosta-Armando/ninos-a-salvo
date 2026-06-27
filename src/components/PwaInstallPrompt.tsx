"use client";

import { Smartphone, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PwaInstallButton } from "@/components/PwaInstallButton";
import { usePwaInstall } from "@/components/PwaInstallProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DISMISS_KEY = "pwa-install-dismissed";

/** Banner opcional en la home (mismo botón nativo que el footer). */
export function PwaInstallPrompt() {
  const { installed, canPromptInstall, ready } = usePwaInstall();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }, []);

  if (!ready || installed || dismissed || !canPromptInstall) return null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Smartphone className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base">
                Instala la app en tu dispositivo
              </CardTitle>
              <CardDescription className="mt-1">
                Acceso rápido desde la pantalla de inicio, ideal para registrar
                niños en campo con conexión limitada.
              </CardDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={dismiss}
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <PwaInstallButton size="lg" />
      </CardContent>
    </Card>
  );
}
