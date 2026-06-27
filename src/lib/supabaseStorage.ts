/**
 * Cliente de Supabase Storage para fotos.
 * Bucket esperado: ninos-fotos (público, políticas INSERT/SELECT/UPDATE para anon).
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const STORAGE_BUCKET = "ninos-fotos";

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

export const supabaseStorage = {
  storage: {
    from: (bucket: string) => getClient().storage.from(bucket),
  },
};

export async function uploadPhoto(
  path: string,
  blob: Blob,
  contentType = "image/jpeg",
): Promise<string> {
  const { error } = await supabaseStorage.storage
    .from(STORAGE_BUCKET)
    .upload(path, blob, {
      contentType,
      upsert: true,
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(`Error al subir foto: ${error.message}`);
  }

  const { data } = supabaseStorage.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

/** Tipos de foto exigidos en el retiro seguro. */
export type RetiroPhotoKind = "cedula" | "persona" | "parentesco";

export async function uploadRetiroPhoto(
  childId: string,
  file: File | Blob,
  kind: RetiroPhotoKind,
): Promise<string> {
  const path = `${childId}/retiro-${kind}.jpg`;
  const contentType = file instanceof File ? file.type || "image/jpeg" : "image/jpeg";
  return uploadPhoto(path, file, contentType);
}
