import type { Prisma } from "../../generated/client";

/** Campos visibles en tarjetas del tablero y fallecidos (sin datos de identidad del niño). */
export const PUBLIC_CHILD_CARD_SELECT = {
  id: true,
  edad_estimada: true,
  edad_anios: true,
  rasgos_particulares: true,
  estado: true,
  ciudad: true,
  estado_resguardo: true,
  detalles_ubicacion: true,
  informante_telefono: true,
} satisfies Prisma.ChildSelect;

/** Ficha pública del niño: permite buscar por nombre, pero no lo expone en la UI. */
export const PUBLIC_CHILD_DETAIL_SELECT = {
  ...PUBLIC_CHILD_CARD_SELECT,
  informante_nombre: true,
  status: true,
  estado_vital: true,
  retiro_cedula: true,
  retiro_fullname: true,
  retiro_parentesco: true,
  retiro_telefono: true,
  retiro_foto_cedula_url: true,
  retiro_foto_persona_url: true,
  retiro_foto_parentesco_url: true,
} satisfies Prisma.ChildSelect;
