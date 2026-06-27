import type { EstadoVital, Prisma } from "../../generated/client";

export const PAGE_SIZE = 20;

export type IdentidadFilter = "todos" | "con_nombre" | "sin_nombre";

export type EdadFilter = "0-2" | "3-5" | "6-8" | "8-10" | "10+";

export const EDAD_FILTER_OPTIONS: { value: EdadFilter; label: string }[] = [
  { value: "0-2", label: "0 a 2 años" },
  { value: "3-5", label: "3 a 5 años" },
  { value: "6-8", label: "6 a 8 años" },
  { value: "8-10", label: "8 a 10 años" },
  { value: "10+", label: "Mayor de 10 años" },
];

export interface TableroSearchParams {
  q?: string;
  page?: string;
  identidad?: string;
  estado?: string;
  ciudad?: string;
  edad?: string;
}

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
    // Búsqueda por identidad interna; los resultados nunca exponen fullname en la UI.
    conditions.push({
      OR: [
        { fullname: { contains: q, mode: "insensitive" } },
        { nombre_padre: { contains: q, mode: "insensitive" } },
        { nombre_madre: { contains: q, mode: "insensitive" } },
        { nombre_familiar_buscado: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  return { AND: conditions };
}

export function parsePage(page?: string): number {
  const n = Number(page);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

export const EDAD_RANGOS_REGISTRO = [
  { value: "0-2", label: "0 a 2 años", anios: 1 },
  { value: "3-5", label: "3 a 5 años", anios: 4 },
  { value: "6-8", label: "6 a 8 años", anios: 7 },
  { value: "8-10", label: "8 a 10 años", anios: 9 },
  { value: "10+", label: "Mayor de 10 años", anios: 11 },
] as const;
