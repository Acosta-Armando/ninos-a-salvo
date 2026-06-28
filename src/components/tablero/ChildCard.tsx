"use client";
import { ChevronRight, Phone } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useOfflineNav } from "@/components/offline/OfflineNavProvider";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { formatEdadEstimada } from "@/lib/edad";
import { requiresConnection } from "@/lib/offlineRoutes";
import { cn } from "@/lib/utils";

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
        "transition-shadow",
        "max-sm:w-full",
        blocked ? "cursor-not-allowed opacity-60" : "hover:shadow-md active:scale-[0.99]",
        "sm:flex sm:h-full sm:flex-col",
      )}
    >
      <CardContent className="space-y-2.5 px-4 sm:space-y-2 sm:px-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-primary">
            {formatEdadEstimada(edad_estimada, edad_anios)}
          </p>
          <ChevronRight
            className="mt-0.5 size-4 shrink-0 text-muted-foreground sm:hidden"
            aria-hidden
          />
        </div>
        {rasgos_particulares ? (
          <p className="text-sm leading-relaxed text-muted-foreground sm:line-clamp-3 sm:text-xs">
            {rasgos_particulares}
          </p>
        ) : null}
        <div className="space-y-1">
          <p className="text-sm font-semibold sm:truncate">
            {ciudad}, {estado}
          </p>
          <p className="text-sm text-muted-foreground sm:truncate sm:text-xs">
            {estado_resguardo}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground sm:line-clamp-2 sm:text-xs">
            {detalles_ubicacion}
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-sm font-medium text-primary sm:text-xs">
          <Phone className="size-3.5 shrink-0 sm:size-3" />
          <span className="break-all sm:truncate">{informante_telefono}</span>
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
        className="block w-full text-left"
        onClick={showOfflinePrompt}
        aria-disabled
      >
        {card}
      </button>
    );
  }

  return (
    <Link href={href} className="block w-full sm:h-full">
      {card}
    </Link>
  );
}
