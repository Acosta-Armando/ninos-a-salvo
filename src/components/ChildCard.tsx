import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ChildCardProps {
  id: string;
  edad_estimada: string;
  estado: string;
  ciudad: string;
  estado_resguardo: string;
  detalles_ubicacion: string;
  informante_telefono: string;
  foto_url: string | null;
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
}: ChildCardProps) {
  const src = foto_url?.startsWith("/") ? foto_url : foto_url ?? "/favicon.ico";

  return (
    <Link href={`/ninos/${id}`} className="group block h-full w-full">
      <Card className="flex h-full flex-col overflow-hidden pt-0 transition-shadow hover:shadow-md">
        {/* Ratio fijo: la foto siempre ocupa el 100% del ancho de la card */}
        <div className="relative w-full shrink-0 overflow-hidden bg-muted aspect-square border rounded-2xl">
          <Image
            src={src}
            alt="Niño en resguardo"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain object-center"
            loading="lazy"
          />
        </div>
        <CardContent className="space-y-2 p-3">
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
    </Link>
  );
}
