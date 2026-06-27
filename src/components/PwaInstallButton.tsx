"use client";
import { Download, ExternalLink, Loader2, Smartphone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePwaInstall } from "@/components/PwaInstallProvider";

interface PwaInstallButtonProps {
  installLabel?: string;
  openLabel?: string;
  size?: "default" | "lg" | "sm";
}

/** Siempre visible: instala la PWA o abre la app si ya está instalada. */
export function PwaInstallButton({
  installLabel = "Instalar app",
  openLabel = "Abrir app",
  size = "default",
}: PwaInstallButtonProps) {
  const { installed, canPromptInstall, ready, install } = usePwaInstall();

  if (!ready) {
    return (
      <Button type="button" className="gap-2" size={size} disabled>
        <Loader2 className="size-4 animate-spin" />
        {installLabel}
      </Button>
    );
  }

  if (installed) {
    return (
      <Button asChild className="gap-2" size={size}>
        <Link href="/">
          <ExternalLink className="size-4" />
          {openLabel}
        </Link>
      </Button>
    );
  }

  if (canPromptInstall) {
    return (
      <Button
        type="button"
        className="gap-2"
        size={size}
        onClick={() => void install()}
      >
        <Download className="size-4" />
        {installLabel}
      </Button>
    );
  }

  return (
    <Button asChild className="gap-2" size={size} variant="secondary">
      <Link href="/">
        <Smartphone className="size-4" />
        {openLabel}
      </Link>
    </Button>
  );
}
