import type { PublicChildCard, PublicChildDetail } from "@/types/public-child";
import {
  buildIdentitySearchTokens,
  decryptString,
  encryptString,
} from "@/lib/crypto";

/** Campos de texto cifrados en PostgreSQL. */
export const ENCRYPTED_CHILD_STRING_FIELDS = [
  "fullname",
  "nombre_padre",
  "nombre_madre",
  "nombre_familiar_buscado",
  "rasgos_particulares",
  "detalles_ubicacion",
  "informante_nombre",
  "informante_telefono",
  "retiro_cedula",
  "retiro_fullname",
  "retiro_parentesco",
  "retiro_telefono",
] as const;

type EncryptedChildStringField = (typeof ENCRYPTED_CHILD_STRING_FIELDS)[number];

type ChildPlainStrings = Partial<
  Record<EncryptedChildStringField, string | null | undefined>
>;

function encryptField(value: string | null | undefined): string | null {
  return encryptString(value);
}

function decryptField(value: string | null | undefined): string | null {
  return decryptString(value);
}

/** Cifra campos sensibles y genera tokens de búsqueda por identidad. */
export function encryptChildStringsForStorage<T extends ChildPlainStrings>(
  data: T,
): T & { identity_search_tokens?: string[] } {
  const encrypted: Record<string, string | null | undefined | string[]> = {
    ...data,
  };

  for (const field of ENCRYPTED_CHILD_STRING_FIELDS) {
    if (field in data) {
      encrypted[field] = encryptField(data[field]);
    }
  }

  const hasIdentityFields =
    "fullname" in data ||
    "nombre_padre" in data ||
    "nombre_madre" in data ||
    "nombre_familiar_buscado" in data;

  if (hasIdentityFields) {
    encrypted.identity_search_tokens = buildIdentitySearchTokens([
      data.fullname,
      data.nombre_padre,
      data.nombre_madre,
      data.nombre_familiar_buscado,
    ]);
  }

  return encrypted as T & { identity_search_tokens?: string[] };
}

function decryptFields<T extends ChildPlainStrings>(record: T): T {
  const decrypted: Record<string, string | null | undefined> = { ...record };
  for (const field of ENCRYPTED_CHILD_STRING_FIELDS) {
    if (field in record && record[field] != null) {
      decrypted[field] = decryptField(record[field]);
    }
  }
  return decrypted as T;
}

export function decryptPublicChildCard(child: PublicChildCard): PublicChildCard {
  return decryptFields(child);
}

export function decryptPublicChildDetail(
  child: PublicChildDetail,
): PublicChildDetail {
  return decryptFields(child);
}
