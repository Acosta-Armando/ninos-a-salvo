import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import type { EstadoVital } from "../../../generated/client";
import { AppHeader } from "@/components/layout/AppHeader";
import { ChildCard } from "@/components/tablero/ChildCard";
import { Pagination } from "@/components/tablero/Pagination";
import { TableroNavTabs } from "@/components/tablero/TableroNavTabs";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE, parsePage } from "@/lib/tablero";
import type { TableroSearchParams } from "@/types/tablero";
import { listTableroChildren } from "@/services";
import { TableroFilters } from "./TableroFilters";

interface TableroPageContentProps {
  estadoVital: EstadoVital;
  basePath: "/tablero" | "/fallecidos";
  params: TableroSearchParams;
  title: string;
  subtitle: string;
  emptyMessage: string;
}

export async function TableroPageContent({
  estadoVital,
  basePath,
  params,
  title,
  subtitle,
  emptyMessage,
}: TableroPageContentProps) {
  const page = parsePage(params.page);

  const { children, total } = await listTableroChildren({
    params,
    estadoVital,
    page,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const esFallecidos = estadoVital === "Fallecido";

  return (
    <div className="min-h-full bg-background">
      <AppHeader title={title} subtitle={subtitle} backHref="/" backLabel="← Inicio" />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <TableroNavTabs esFallecidos={esFallecidos} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {total} registro{total !== 1 ? "s" : ""} en búsqueda activa
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/registro">
              <Plus className="size-4" />
              Registrar
            </Link>
          </Button>
        </div>

        <Suspense fallback={null}>
          <TableroFilters params={params} basePath={basePath} />
        </Suspense>

        {children.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">{emptyMessage}</p>
            <Button asChild variant="link" className="mt-4">
              <Link href="/registro">Registrar</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Mostrando {children.length} de {total}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
              {children.map((child) => (
                <ChildCard key={child.id} {...child} esFallecido={esFallecidos} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              total={total}
              params={params}
              basePath={basePath}
            />
          </>
        )}
      </main>
    </div>
  );
}
