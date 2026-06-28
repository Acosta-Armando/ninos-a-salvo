/** Rutas que deben funcionar sin internet (deben coincidir con public/sw.js). */
export const OFFLINE_ROUTES = ["/", "/registro", "/ayuda", "/mis-registros"] as const;

function normalizePath(pathname: string): string {
  const path = pathname.replace(/\/$/, "");
  return path === "" ? "/" : path;
}

/** Indica si la ruta necesita conexión (tablero, fallecidos, fichas, etc.). */
export function requiresConnection(href: string): boolean {
  const pathname = href.split("?")[0].split("#")[0];
  return !OFFLINE_ROUTES.includes(
    normalizePath(pathname) as (typeof OFFLINE_ROUTES)[number],
  );
}
