import { NextResponse } from "next/server";
import { downloadDecryptedPhoto } from "@/lib/storageServer";
import { normalizeStoragePath } from "@/lib/storageUrl";

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { path: segments } = await params;
    const path = normalizeStoragePath(segments.join("/"));

    if (!path) {
      return NextResponse.json({ error: "Ruta inválida." }, { status: 400 });
    }

    const buffer = await downloadDecryptedPhoto(path);
    const contentType = path.endsWith(".png")
      ? "image/png"
      : path.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("GET /api/media/[...path]:", error);
    return NextResponse.json(
      { error: "No se pudo cargar la imagen." },
      { status: 404 },
    );
  }
}
