"use client";
import Image from "next/image";
import { Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { requiresConnection } from "@/lib/offlineRoutes";
import { cn } from "@/lib/utils";
import { useOfflineNav } from "@/components/OfflineNavProvider";
import { SinFotoPlaceholder } from "@/components/SinFotoPlaceholder";
import Link from "next/link";

interface ChildCardProps {
  id: string;
  edad_estimada: string;
  estado: string;
  ciudad: string;
  estado_resguardo: string;
  detalles_ubicacion: string;
  informante_telefono: string;
  foto_url: string | null;
  esFallecido?: boolean;
}

export function ChildCard({
  id,
  edad_estimada,
  estado,
  ciudad,
  estado_resguardo,
  detalles_ubicacion,
  informante_telefono,
  foto_url,
  esFallecido = false,
}: ChildCardProps) {
  const online = useOnlineStatus();
  const { showOfflinePrompt } = useOfflineNav();
  const href = `/ninos/${id}`;
  const blocked = requiresConnection(href) && !online;
  const src = foto_url?.startsWith("/") ? foto_url : foto_url ?? "/favicon.ico";

  const card = (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden pt-0 transition-shadow gap-1",
        blocked ? "cursor-not-allowed opacity-60" : "hover:shadow-md",
      )}
    >
      <div
        className={cn(
          "relative aspect-square w-full shrink-0 overflow-hidden rounded-t-xl",
          esFallecido ? "bg-black" : "bg-muted",
        )}
        aria-label={esFallecido ? "Sin foto" : undefined}
      >
        {esFallecido ? (
          <SinFotoPlaceholder textClassName="text-xs sm:text-sm" />
        ) : (
          <Image
            src={src}
            alt="Niño en resguardo"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain object-center"
            loading="lazy"
          />
        )}
      </div>
      <CardContent className="space-y-2 px-3">
        <p className="text-sm font-medium text-primary">{edad_estimada}</p>
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
