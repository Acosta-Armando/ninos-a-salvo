import type { EstadoVital, Prisma } from "../../generated/client";
import { queryToSearchTokens } from "@/lib/crypto";
import type {
  EdadFilter,
  IdentidadFilter,
  TableroSearchParams,
} from "@/types/tablero";
import { PAGE_SIZE } from "@/types/tablero";

export { PAGE_SIZE } from "@/types/tablero";
export type { EdadFilter, IdentidadFilter, TableroSearchParams } from "@/types/tablero";

export function edadFilterToRange(
  edad?: string,
): Prisma.IntFilter | undefined {
  switch (edad as EdadFilter) {
    case "0-2":
      return { gte: 0, lte: 2 };
    case "3-5":
      return { gte: 3, lte: 5 };
    case "6-8":
      return { gte: 6, lte: 8 };
    case "8-10":
      return { gte: 8, lte: 10 };
    case "10+":
      return { gt: 10 };
    default:
      return undefined;
  }
}

/**
 * Construye el filtro Prisma para tablero y fallecidos.
 * La búsqueda por nombre (q) no expone esos campos en la respuesta; ver publicChild.ts.
 */
export function buildTableroWhere(
  params: TableroSearchParams,
  estadoVital: EstadoVital,
): Prisma.ChildWhereInput {
  const q = params.q?.trim();
  const identidad = (params.identidad ?? "todos") as IdentidadFilter;
  const edadRange = edadFilterToRange(params.edad);

  const conditions: Prisma.ChildWhereInput[] = [
    { status: "Buscando" },
    { estado_vital: estadoVital },
  ];

  if (params.estado) {
    conditions.push({ estado: params.estado });
  }

  if (params.ciudad) {
    conditions.push({ ciudad: params.ciudad });
  }

  if (edadRange) {
    conditions.push({ edad_anios: edadRange });
  }

  if (identidad === "con_nombre") {
    conditions.push({ fullname: { not: null } }, { NOT: { fullname: "" } });
  } else if (identidad === "sin_nombre") {
    conditions.push({ OR: [{ fullname: null }, { fullname: "" }] });
  }

  if (q) {
    const tokens = queryToSearchTokens(q);
    if (tokens.length > 0) {
      conditions.push({
        identity_search_tokens: { hasSome: tokens },
      });
    }
  }

  return { AND: conditions };
}

export function parsePage(page?: string): number {
  const n = Number(page);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}
