import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { decryptBuffer, encryptBuffer } from "@/lib/crypto";
import { getStorageBucketName } from "@/lib/storageUrl";
import { withTimeout } from "@/lib/withTimeout";

const UPLOAD_TIMEOUT_MS = 25_000;
const DOWNLOAD_TIMEOUT_MS = 25_000;

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
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

/** Sube bytes cifrados al bucket y devuelve la ruta relativa. */
export async function uploadEncryptedPhoto(
  path: string,
  data: Buffer,
  contentType = "application/octet-stream",
): Promise<string> {
  const encrypted = encryptBuffer(data);
  const upload = getBucket().upload(path, encrypted, {
    contentType,
    upsert: true,
    cacheControl: "3600",
  });

  const { error } = await withTimeout(
    upload,
    UPLOAD_TIMEOUT_MS,
    "Tiempo de espera agotado al subir la foto.",
  );

  if (error) {
    throw new Error(`Error al subir foto: ${error.message}`);
  }

  return path;
}

/** Descarga y descifra una foto del bucket. */
export async function downloadDecryptedPhoto(path: string): Promise<Buffer> {
  const download = getBucket().download(path);
  const { data, error } = await withTimeout(
    download,
    DOWNLOAD_TIMEOUT_MS,
    "Tiempo de espera agotado al descargar la foto.",
  );

  if (error || !data) {
    throw new Error(`Error al descargar foto: ${error?.message ?? "sin datos"}`);
  }

  const raw = Buffer.from(await data.arrayBuffer());
  return decryptBuffer(raw);
}
