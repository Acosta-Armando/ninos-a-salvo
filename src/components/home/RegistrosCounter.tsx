import { Users } from "lucide-react";
import { getTotalRegistrosCount } from "@/services";

/** Contador público: todos los registros en la plataforma. */
export async function RegistrosCounter() {
  const total = await getTotalRegistrosCount();

  return (
    <div
      className="w-full rounded-2xl border border-primary/30 bg-linear-to-br from-primary/12 via-primary/5 to-background px-4 py-4 shadow-sm ring-1 ring-primary/10 sm:px-6 sm:py-5"
      aria-label={`${total.toLocaleString("es-VE")} registros en la plataforma`}
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/15 text-primary sm:size-14">
          <Users className="size-6 sm:size-7" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-3xl font-bold leading-none tabular-nums tracking-tight text-foreground sm:text-4xl">
            {total.toLocaleString("es-VE")}
          </p>
          <p className="mt-1.5 text-sm font-semibold text-foreground/90">
            Registros en la plataforma
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Niños, niñas y adolescentes registrados en puntos de resguardo desde
            el inicio de la emergencia.
          </p>
        </div>
      </div>
    </div>
  );
}
