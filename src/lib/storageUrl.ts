/**
 * Rutas relativas en Storage (lo que se guarda en BD) y URLs públicas construidas en runtime.
 *
 * Formato URL:
 * {NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/{NEXT_PUBLIC_BUCKET_TYPE}/{NEXT_PUBLIC_BUCKET_NAME}/{path}
 *
 * Ejemplo path en BD (retiro): `uuid/retiro-cedula.jpg`
 */

export function getStorageBucketName(): string {
  const name = process.env.NEXT_PUBLIC_BUCKET_NAME;
  if (!name) {
    throw new Error("Configura NEXT_PUBLIC_BUCKET_NAME");
  }
  return name;
}

export function getStorageBucketType(): string {
  return process.env.NEXT_PUBLIC_BUCKET_TYPE ?? "public";
}

/** Extrae la ruta relativa si el valor es una URL completa (datos legacy). */
export function normalizeStoragePath(
  value: string | null | undefined,
): string | null {
  if (!value?.trim()) return null;

  const trimmed = value.trim();

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return trimmed.replace(/^\/+/, "");
  }

  try {
    const url = new URL(trimmed);
    const marker = "/storage/v1/object/";
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return trimmed;

    const rest = url.pathname.slice(idx + marker.length);
    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
    const bucketType = getStorageBucketType();
    const prefix = `${bucketType}/${bucketName}/`;

    if (bucketName && rest.startsWith(prefix)) {
      return decodeURIComponent(rest.slice(prefix.length));
    }

    if (bucketName) {
      const parts = rest.split("/");
      const bucketIdx = parts.indexOf(bucketName);
      if (bucketIdx >= 0 && bucketIdx < parts.length - 1) {
        return decodeURIComponent(parts.slice(bucketIdx + 1).join("/"));
      }
    }

    return trimmed;
  } catch {
    return trimmed;
  }
}

/** Construye la URL pública a partir de la ruta guardada en BD. */
export function buildStoragePublicUrl(
  path: string | null | undefined,
): string | null {
  const normalized = normalizeStoragePath(path);
  if (!normalized) return null;

  if (normalized.startsWith("/")) {
    return normalized;
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const bucket = process.env.NEXT_PUBLIC_BUCKET_NAME;
  if (!base || !bucket) return null;

  const encodedPath = normalized
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${base}/storage/v1/object/${getStorageBucketType()}/${bucket}/${encodedPath}`;
}

/** Resuelve src para `<Image>`: rutas locales, paths de BD o URLs legacy. */
export function resolveImageSrc(
  stored: string | null | undefined,
  fallback = "/favicon.ico",
): string {
  if (!stored?.trim()) return fallback;

  if (stored.startsWith("/")) return stored;

  if (stored.startsWith("http://") || stored.startsWith("https://")) {
    return stored;
  }

  const normalized = normalizeStoragePath(stored);
  if (!normalized) return fallback;

  const encoded = normalized
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `/api/media/${encoded}`;
}

/** Normaliza campos de foto de retiro antes de persistir en PostgreSQL. */
export function normalizeChildPhotoFields<
  T extends {
    retiro_foto_cedula_url?: string | null;
    retiro_foto_persona_url?: string | null;
    retiro_foto_parentesco_url?: string | null;
  },
>(data: T): T {
  return {
    ...data,
    retiro_foto_cedula_url:
      normalizeStoragePath(data.retiro_foto_cedula_url) ??
      data.retiro_foto_cedula_url,
    retiro_foto_persona_url:
      normalizeStoragePath(data.retiro_foto_persona_url) ??
      data.retiro_foto_persona_url,
    retiro_foto_parentesco_url:
      normalizeStoragePath(data.retiro_foto_parentesco_url) ??
      data.retiro_foto_parentesco_url,
  };
}
