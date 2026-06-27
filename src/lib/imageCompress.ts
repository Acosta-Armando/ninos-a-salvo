const MAX_SIZE_BYTES = 150 * 1024;

export async function compressImage(
  file: File | Blob,
  maxBytes = MAX_SIZE_BYTES,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No se pudo procesar la imagen");
  }

  let width = bitmap.width;
  let height = bitmap.height;
  let quality = 0.85;

  const maxDimension = 1200;
  if (width > maxDimension || height > maxDimension) {
    const ratio = Math.min(maxDimension / width, maxDimension / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > maxBytes && quality > 0.2) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, quality);
  }

  while (blob.size > maxBytes && width > 200) {
    width = Math.round(width * 0.85);
    height = Math.round(height * 0.85);
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(
      await createImageBitmap(file),
      0,
      0,
      width,
      height,
    );
    blob = await canvasToBlob(canvas, quality);
  }

  return blob;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Error al comprimir imagen"));
      },
      "image/jpeg",
      quality,
    );
  });
}
