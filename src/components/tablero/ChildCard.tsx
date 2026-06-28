"use client";
import { Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { requiresConnection } from "@/lib/offlineRoutes";
import { formatEdadEstimada } from "@/lib/edad";
import { cn } from "@/lib/utils";
import { useOfflineNav } from "@/components/offline/OfflineNavProvider";
import Link from "next/link";

interface ChildCardProps {
  id: string;
  edad_estimada: string;
  edad_anios: number;
  rasgos_particulares: string | null;
  estado: string;
  ciudad: string;
  estado_resguardo: string;
  detalles_ubicacion: string;
  informante_telefono: string;
  esFallecido?: boolean;
}

export function ChildCard({
  id,
  edad_estimada,
  edad_anios,
  rasgos_particulares,
  estado,
  ciudad,
  estado_resguardo,
  detalles_ubicacion,
  informante_telefono,
  esFallecido = false,
}: ChildCardProps) {
  const online = useOnlineStatus();
  const { showOfflinePrompt } = useOfflineNav();
  const href = `/ninos/${id}`;
  const blocked = requiresConnection(href) && !online;

  const card = (
    <Card
      className={cn(
        "flex h-full flex-col transition-shadow",
        blocked ? "cursor-not-allowed opacity-60" : "hover:shadow-md",
      )}
    >
      <CardContent className="space-y-2 p-3">
        <p className="text-sm font-medium text-primary">
          {formatEdadEstimada(edad_estimada, edad_anios)}
        </p>
        {rasgos_particulares ? (
          <p className="line-clamp-3 text-xs text-muted-foreground">
            {rasgos_particulares}
          </p>
        ) : null}
        <p className="truncate text-sm font-semibold">
          {ciudad}, {estado}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {estado_resguardo}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {detalles_ubicacion}
        </p>
        <p className="flex items-center gap-1 text-xs font-medium text-primary">
          <Phone className="size-3 shrink-0" />
          <span className="truncate">{informante_telefono}</span>
        </p>
        {esFallecido ? (
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Identificación familiar
          </p>
        ) : null}
      </CardContent>
    </Card>
  );

  if (blocked) {
    return (
      <button
        type="button"
        className="group block h-full w-full text-left"
        onClick={showOfflinePrompt}
        aria-disabled
      >
        {card}
      </button>
    );
  }

  return (
    <Link href={href} className="group block h-full w-full">
      {card}
    </Link>
  );
}
