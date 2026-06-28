/**
 * Cliente de Supabase Storage para fotos.
 * En BD solo se guarda la ruta relativa; la URL pública se arma en storageUrl.ts.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getStorageBucketName } from "./storageUrl";
import { withTimeout } from "./withTimeout";

const UPLOAD_TIMEOUT_MS = 25_000;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
    }
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

function getBucket() {
  return getClient().storage.from(getStorageBucketName());
}

/** Sube un archivo y devuelve la ruta relativa dentro del bucket (para guardar en BD). */
export async function uploadPhoto(
  path: string,
  blob: Blob,
  contentType = "image/jpeg",
): Promise<string> {
  const upload = getBucket().upload(path, blob, {
    contentType,
    upsert: true,
    cacheControl: "3600",
  });

  const { error } = await withTimeout(
    upload,
    UPLOAD_TIMEOUT_MS,
    "Tiempo de espera agotado al subir la foto. Se reintentará al reconectar.",
  );

  if (error) {
    throw new Error(`Error al subir foto: ${error.message}`);
  }

  return path;
}

/** Tipos de foto exigidos en el retiro seguro. */
export type RetiroPhotoKind = "cedula" | "persona" | "parentesco";

export async function uploadRetiroPhoto(
  childId: string,
  file: File | Blob,
  kind: RetiroPhotoKind,
): Promise<string> {
  const path = `${childId}/retiro-${kind}.jpg`;
  const contentType =
    file instanceof File ? file.type || "image/jpeg" : "image/jpeg";
  return uploadPhoto(path, file, contentType);
}
