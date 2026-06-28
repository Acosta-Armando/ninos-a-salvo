import type { RetiroPhotoKind } from "@/lib/supabaseStorage";

/** Sube una foto de retiro cifrada vía API. */
export async function uploadRetiroPhotoViaApi(
  childId: string,
  file: File | Blob,
  kind: RetiroPhotoKind,
): Promise<string> {
  const form = new FormData();
  form.append("photo", file, `retiro-${kind}.jpg`);

  const response = await fetch(
    `/api/ninos/${childId}/retiro/foto?kind=${kind}`,
    {
      method: "POST",
      body: form,
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "No se pudo subir la foto de retiro.");
  }

  const data = (await response.json()) as { path: string };
  return data.path;
}
