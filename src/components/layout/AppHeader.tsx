import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export function AppHeader({
  title = "Niños a Salvo",
  subtitle = "Reencuentro familiar — Venezuela",
  backHref,
  backLabel = "← Inicio",
}: AppHeaderProps) {
  return (
    <header className="sticky top-(--status-bars-height,0px) z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="min-w-0 flex-1">
          {backHref ? (
            <a
              href={backHref}
              className="mb-1 inline-block text-sm text-primary hover:underline"
            >
              {backLabel}
            </a>
          ) : null}
          <h1 className="truncate text-xl font-bold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
