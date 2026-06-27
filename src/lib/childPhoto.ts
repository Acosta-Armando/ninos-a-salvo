import type { LocalChild } from "./types";

/** Obtiene el Blob de la foto desde Dexie (Blob directo o ArrayBuffer persistido). */
export function resolveChildPhotoBlob(child: LocalChild): Blob | undefined {
  if (child.foto_blob instanceof Blob) return child.foto_blob;
  if (child.foto_data) {
    return new Blob([child.foto_data], {
      type: child.foto_mime ?? "image/jpeg",
    });
  }
  return undefined;
}
