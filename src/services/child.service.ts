/**
 * Servicio de niños: única capa que ejecuta consultas Prisma.
 * Páginas servidor y rutas API deben usar estas funciones, no prisma directamente.
 */
import type { Child, EstadoVital } from "../../generated/client";
import {
  decryptPublicChildCard,
  decryptPublicChildDetail,
  encryptChildStringsForStorage,
} from "@/lib/childCrypto";
import { prisma } from "@/lib/prisma";
import {
  PUBLIC_CHILD_CARD_SELECT,
  PUBLIC_CHILD_DETAIL_SELECT,
} from "@/lib/publicChild";
import {
  PAGE_SIZE,
  buildTableroWhere,
} from "@/lib/tablero";
import type { TableroSearchParams } from "@/types/tablero";
import type { PublicChildCard, PublicChildDetail } from "@/types/public-child";
import type { ChildPayload, RetiroPayload } from "@/types/child";
import type { ChildStatusSnapshot } from "@/types/mis-registros";
import { hashManageToken, verifyManageToken } from "@/lib/crypto";
import { normalizeChildPhotoFields } from "@/lib/storageUrl";
import {
  ChildAlreadyDeliveredError,
  ChildNotFoundError,
  InvalidChildPayloadError,
  InvalidManageTokenError,
  InvalidRetiroPayloadError,
} from "./errors";

/** Mapea el payload de sync/API al shape de Prisma (create/update). */
function childPayloadToData(body: ChildPayload) {
  const normalized = normalizeChildPhotoFields({
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
  });

  let encrypted: ReturnType<typeof encryptChildStringsForStorage>;
  try {
    encrypted = encryptChildStringsForStorage(normalized);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al cifrar el registro";
    if (message.includes("AUTH_SECRET")) {
      throw new InvalidChildPayloadError(
        "El servidor no tiene AUTH_SECRET configurado",
      );
    }
    throw error;
  }

  if (!encrypted.informante_nombre?.trim() || !encrypted.informante_telefono?.trim()) {
    throw new InvalidChildPayloadError("Datos del informante incompletos");
  }
  if (!encrypted.rasgos_particulares?.trim()) {
    throw new InvalidChildPayloadError("Rasgos particulares obligatorios");
  }
  if (!encrypted.detalles_ubicacion?.trim()) {
    throw new InvalidChildPayloadError("Descripción de ubicación obligatoria");
  }

  return encrypted;
}

function childPayloadScalars(body: ChildPayload) {
  return {
    edad_estimada: body.edad_estimada.trim(),
    edad_anios: Number(body.edad_anios),
    estado: body.estado.trim(),
    ciudad: body.ciudad.trim(),
    estado_resguardo: body.estado_resguardo.trim(),
    estado_vital: body.estado_vital,
  };
}

/** Valida campos mínimos antes de upsert desde /api/ninos. */
export function assertValidChildPayload(body: ChildPayload): void {
  const edadAnios = Number(body.edad_anios);

  if (
    !body.id ||
    !body.edad_estimada?.trim() ||
    !Number.isFinite(edadAnios) ||
    !body.estado?.trim() ||
    !body.ciudad?.trim() ||
    !body.estado_resguardo?.trim() ||
    !body.estado_vital ||
    !body.rasgos_particulares?.trim() ||
    !body.detalles_ubicacion?.trim() ||
    !body.informante_nombre?.trim() ||
    !body.informante_telefono?.trim()
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

    return {
      children: children.map(decryptPublicChildCard),
      total,
    };
  } catch {
    // Si la BD no está disponible, el tablero muestra vacío en lugar de error 500.
    return { children: [], total: 0 };
  }
}

/** Ficha pública por ID; null si no existe. */
export async function getPublicChildById(
  id: string,
): Promise<PublicChildDetail | null> {
  const child = await prisma.child.findUnique({
    where: { id },
    select: PUBLIC_CHILD_DETAIL_SELECT,
  });

  if (!child) return null;
  return decryptPublicChildDetail(child);
}

/** Crea o actualiza un niño (idempotente por UUID del cliente). */
export async function upsertChild(
  body: ChildPayload,
): Promise<{ id: string; status: Child["status"] }> {
  assertValidChildPayload(body);

  const data = childPayloadToData({
    ...body,
    edad_anios: Number(body.edad_anios),
  });
  const scalars = childPayloadScalars(body);

  const existing = await prisma.child.findUnique({
    where: { id: body.id },
    select: { manage_token_hash: true, status: true },
  });

  const manageHash =
    body.manage_token?.trim() &&
    (!existing || !existing.manage_token_hash)
      ? hashManageToken(body.manage_token.trim())
      : undefined;

  const status =
    existing &&
    body.status === "Reencontrado" &&
    existing.status !== "Reencontrado"
      ? existing.status
      : (body.status ?? existing?.status ?? "Buscando");

  const createdAt = body.created_at ? new Date(body.created_at) : undefined;
  if (createdAt && Number.isNaN(createdAt.getTime())) {
    throw new InvalidChildPayloadError("Fecha de registro inválida");
  }

  const stored = {
    ...scalars,
    ...data,
    informante_nombre: data.informante_nombre!,
    informante_telefono: data.informante_telefono!,
    detalles_ubicacion: data.detalles_ubicacion!,
    rasgos_particulares: data.rasgos_particulares!,
  };

  const child = await prisma.child.upsert({
    where: { id: body.id },
    create: {
      id: body.id,
      ...stored,
      status,
      manage_token_hash: manageHash,
      created_at: createdAt,
    },
    update: {
      ...stored,
      status,
      ...(manageHash ? { manage_token_hash: manageHash } : {}),
    },
  });

  return { id: child.id, status: child.status };
}

/** Total de registros en la plataforma (incluye entregados y fallecidos). */
export async function getTotalRegistrosCount(): Promise<number> {
  try {
    return await prisma.child.count();
  } catch {
    return 0;
  }
}

const MAX_STATUS_IDS = 50;

/** Estado público de registros por ID (solo para refrescar mis-registros). */
export async function getChildrenStatusByIds(
  ids: string[],
): Promise<ChildStatusSnapshot[]> {
  const unique = [...new Set(ids.map((id) => id.trim()).filter(Boolean))].slice(
    0,
    MAX_STATUS_IDS,
  );
  if (unique.length === 0) return [];

  const rows = await prisma.child.findMany({
    where: { id: { in: unique } },
    select: { id: true, status: true, estado_vital: true },
  });

  return rows;
}

/**
 * Marca un registro como reencontrado (sale del tablero).
 * Requiere el token de gestión del dispositivo que registró.
 */
export async function markChildReencontrado(
  id: string,
  manageToken: string,
): Promise<Child> {
  const token = manageToken?.trim();
  if (!token) {
    throw new InvalidManageTokenError();
  }

  const existing = await prisma.child.findUnique({ where: { id } });

  if (!existing) {
    throw new ChildNotFoundError(id);
  }

  if (existing.status === "Reencontrado") {
    throw new ChildAlreadyDeliveredError();
  }

  if (!verifyManageToken(token, existing.manage_token_hash)) {
    throw new InvalidManageTokenError();
  }

  return prisma.child.update({
    where: { id },
    data: { status: "Reencontrado" },
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

  const encrypted = encryptChildStringsForStorage(
    normalizeChildPhotoFields({
      retiro_cedula: body.retiro_cedula.trim(),
      retiro_fullname: body.retiro_fullname.trim(),
      retiro_parentesco: body.retiro_parentesco.trim(),
      retiro_telefono: body.retiro_telefono.trim(),
      retiro_foto_cedula_url: body.retiro_foto_cedula_url,
      retiro_foto_persona_url: body.retiro_foto_persona_url,
      retiro_foto_parentesco_url: body.retiro_foto_parentesco_url,
    }),
  );

  return prisma.child.update({
    where: { id },
    data: {
      ...encrypted,
      status: "Reencontrado",
    },
  });
}
