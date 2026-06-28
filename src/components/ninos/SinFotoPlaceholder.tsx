import { cn } from "@/lib/utils";

interface SinFotoPlaceholderProps {
  className?: string;
  textClassName?: string;
}

/** Marca sobre fondo negro cuando no hay fotografía (p. ej. registro fallecido). */
export function SinFotoPlaceholder({
  className,
  textClassName,
}: SinFotoPlaceholderProps) {
  return (
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        className,
      )}
      aria-hidden
    >
      <span
        className={cn(
          "-rotate-45 font-medium tracking-wide text-white select-none",
          textClassName ?? "text-sm sm:text-base",
        )}
      >
        Sin foto
      </span>
    </span>
  );
}
