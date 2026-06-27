/**
 * Servicio de niños: única capa que ejecuta consultas Prisma.
 * Páginas servidor y rutas API deben usar estas funciones, no prisma directamente.
 */
import type { Child, EstadoVital } from "../../generated/client";
import { prisma } from "@/lib/prisma";
import {
  PUBLIC_CHILD_CARD_SELECT,
  PUBLIC_CHILD_DETAIL_SELECT,
  type PublicChildCard,
  type PublicChildDetail,
} from "@/lib/publicChild";
import {
  PAGE_SIZE,
  buildTableroWhere,
  type TableroSearchParams,
} from "@/lib/tablero";
import type { ChildPayload, RetiroPayload } from "@/lib/types";
import {
  ChildAlreadyDeliveredError,
  ChildNotFoundError,
  InvalidChildPayloadError,
  InvalidRetiroPayloadError,
} from "./errors";

/** Mapea el payload de sync/API al shape de Prisma (create/update). */
function childPayloadToData(body: ChildPayload) {
  return {
    fullname: body.fullname,
    edad_estimada: body.edad_estimada,
    edad_anios: body.edad_anios,
    nombre_padre: body.nombre_padre,
    nombre_madre: body.nombre_madre,
    nombre_familiar_buscado: body.nombre_familiar_buscado,
    rasgos_particulares: body.rasgos_particulares,
    estado: body.estado,
    ciudad: body.ciudad,
    estado_resguardo: body.estado_resguardo,
    detalles_ubicacion: body.detalles_ubicacion,
    foto_url: body.foto_url,
    informante_nombre: body.informante_nombre,
    informante_telefono: body.informante_telefono,
    estado_vital: body.estado_vital,
    retiro_cedula: body.retiro_cedula,
    retiro_fullname: body.retiro_fullname,
    retiro_parentesco: body.retiro_parentesco,
    retiro_telefono: body.retiro_telefono,
    retiro_foto_cedula_url: body.retiro_foto_cedula_url,
    retiro_foto_persona_url: body.retiro_foto_persona_url,
    retiro_foto_parentesco_url: body.retiro_foto_parentesco_url,
  };
}

/** Valida campos mínimos antes de upsert desde /api/ninos. */
export function assertValidChildPayload(body: ChildPayload): void {
  if (
    !body.id ||
    !body.edad_estimada ||
    body.edad_anios === undefined ||
    !body.estado ||
    !body.ciudad ||
    !body.estado_resguardo ||
    !body.estado_vital
  ) {
    throw new InvalidChildPayloadError();
  }
}

const RETIRO_REQUIRED_FIELDS: (keyof RetiroPayload)[] = [
  "retiro_cedula",
  "retiro_fullname",
  "retiro_parentesco",
  "retiro_telefono",
  "retiro_foto_cedula_url",
  "retiro_foto_persona_url",
  "retiro_foto_parentesco_url",
];

/** Valida retiro completo (datos + tres URLs de foto). */
export function assertValidRetiroPayload(body: RetiroPayload): void {
  for (const field of RETIRO_REQUIRED_FIELDS) {
    if (!body[field]?.trim()) {
      throw new InvalidRetiroPayloadError(`Campo obligatorio: ${field}`);
    }
  }
}

/**
 * Listado paginado del tablero o fallecidos.
 * Solo devuelve campos públicos (sin nombre del niño).
 */
export async function listTableroChildren(options: {
  params: TableroSearchParams;
  estadoVital: EstadoVital;
  page: number;
}): Promise<{ children: PublicChildCard[]; total: number }> {
  const where = buildTableroWhere(options.params, options.estadoVital);
  const skip = (options.page - 1) * PAGE_SIZE;

  try {
    const [children, total] = await Promise.all([
      prisma.child.findMany({
        where,
        orderBy: { updated_at: "desc" },
        skip,
        take: PAGE_SIZE,
        select: PUBLIC_CHILD_CARD_SELECT,
      }),
      prisma.child.count({ where }),
    ]);

    return { children, total };
  } catch {
    // Si la BD no está disponible, el tablero muestra vacío en lugar de error 500.
    return { children: [], total: 0 };
  }
}

/** Ficha pública por ID; null si no existe. */
export async function getPublicChildById(
  id: string,
): Promise<PublicChildDetail | null> {
  return prisma.child.findUnique({
    where: { id },
    select: PUBLIC_CHILD_DETAIL_SELECT,
  });
}

/** Crea o actualiza un niño (idempotente por UUID del cliente). */
export async function upsertChild(body: ChildPayload): Promise<Child> {
  assertValidChildPayload(body);

  const data = childPayloadToData(body);

  return prisma.child.upsert({
    where: { id: body.id },
    create: {
      id: body.id,
      ...data,
      status: body.status ?? "Buscando",
      created_at: body.created_at ? new Date(body.created_at) : undefined,
    },
    update: {
      ...data,
      status: body.status,
    },
  });
}

/**
 * Registra la entrega del niño y marca status = Reencontrado.
 * @throws ChildNotFoundError | ChildAlreadyDeliveredError
 */
export async function registerChildRetiro(
  id: string,
  body: RetiroPayload,
): Promise<Child> {
  assertValidRetiroPayload(body);

  const existing = await prisma.child.findUnique({ where: { id } });

  if (!existing) {
    throw new ChildNotFoundError(id);
  }

  if (existing.status === "Reencontrado") {
    throw new ChildAlreadyDeliveredError();
  }

  return prisma.child.update({
    where: { id },
    data: {
      retiro_cedula: body.retiro_cedula.trim(),
      retiro_fullname: body.retiro_fullname.trim(),
      retiro_parentesco: body.retiro_parentesco.trim(),
      retiro_telefono: body.retiro_telefono.trim(),
      retiro_foto_cedula_url: body.retiro_foto_cedula_url,
      retiro_foto_persona_url: body.retiro_foto_persona_url,
      retiro_foto_parentesco_url: body.retiro_foto_parentesco_url,
      status: "Reencontrado",
    },
  });
}
