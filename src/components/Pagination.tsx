import Link from "next/link";
import type { TableroSearchParams } from "@/lib/tablero";

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
          <Link
            href={buildHref(currentPage - 1, params, basePath)}
            className="rounded-lg border px-4 py-2.5 text-sm hover:bg-muted"
          >
            ← Anterior
          </Link>
        )}
        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 text-muted-foreground">…</span>
              )}
              <Link
                href={buildHref(p, params, basePath)}
                className={`min-w-10 rounded-lg px-4 py-2.5 text-center text-sm ${
                  p === currentPage
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "border hover:bg-muted"
                }`}
              >
                {p}
              </Link>
            </span>
          );
        })}
        {currentPage < totalPages && (
          <Link
            href={buildHref(currentPage + 1, params, basePath)}
            className="rounded-lg border px-4 py-2.5 text-sm hover:bg-muted"
          >
            Siguiente →
          </Link>
        )}
      </div>
    </nav>
  );
}
