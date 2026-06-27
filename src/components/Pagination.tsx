"use client";

import Link from "next/link";
import type { TableroSearchParams } from "@/lib/tablero";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { requiresConnection } from "@/lib/offlineRoutes";
import { cn } from "@/lib/utils";
import { useOfflineNav } from "@/components/OfflineNavProvider";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  params: TableroSearchParams;
  basePath: "/tablero" | "/fallecidos";
}

function buildHref(
  page: number,
  params: TableroSearchParams,
  basePath: string,
): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.identidad && params.identidad !== "todos") {
    sp.set("identidad", params.identidad);
  }
  if (params.estado) sp.set("estado", params.estado);
  if (params.ciudad) sp.set("ciudad", params.ciudad);
  if (params.edad) sp.set("edad", params.edad);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function PageNavItem({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const online = useOnlineStatus();
  const { showOfflinePrompt } = useOfflineNav();
  const blocked = requiresConnection(href) && !online;

  if (!blocked) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(className, "cursor-not-allowed opacity-50")}
      onClick={showOfflinePrompt}
      aria-disabled
    >
      {children}
    </button>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  params,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      (p >= currentPage - 2 && p <= currentPage + 2),
  );

  return (
    <nav
      className="mt-8 flex flex-col items-center gap-3"
      aria-label="Paginación"
    >
      <p className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages} · {total} registro
        {total !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {currentPage > 1 && (
          <PageNavItem
            href={buildHref(currentPage - 1, params, basePath)}
            className="rounded-lg border px-4 py-2.5 text-sm hover:bg-muted"
          >
            ← Anterior
          </PageNavItem>
        )}
        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          const href = buildHref(p, params, basePath);
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 text-muted-foreground">…</span>
              )}
              <PageNavItem
                href={href}
                className={`min-w-10 rounded-lg px-4 py-2.5 text-center text-sm ${
                  p === currentPage
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "border hover:bg-muted"
                }`}
              >
                {p}
              </PageNavItem>
            </span>
          );
        })}
        {currentPage < totalPages && (
          <PageNavItem
            href={buildHref(currentPage + 1, params, basePath)}
            className="rounded-lg border px-4 py-2.5 text-sm hover:bg-muted"
          >
            Siguiente →
          </PageNavItem>
        )}
      </div>
    </nav>
  );
}
