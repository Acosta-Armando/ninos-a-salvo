import { NextResponse } from "next/server";
import type { RetiroPhotoKind } from "@/lib/supabaseStorage";
import { uploadEncryptedPhoto } from "@/lib/storageServer";

const VALID_KINDS: RetiroPhotoKind[] = ["cedula", "persona", "parentesco"];

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const kind = url.searchParams.get("kind") as RetiroPhotoKind | null;

    if (!kind || !VALID_KINDS.includes(kind)) {
      return NextResponse.json(
        { error: "Tipo de foto de retiro inválido." },
        { status: 400 },
      );
    }

    const form = await request.formData();
    const file = form.get("photo");

    if (!(file instanceof Blob) || file.size === 0) {
      return NextResponse.json({ error: "Falta la foto." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const path = `${id}/retiro-${kind}.jpg`;
    await uploadEncryptedPhoto(path, buffer);

    return NextResponse.json({ path });
  } catch (error) {
    console.error("POST /api/ninos/[id]/retiro/foto:", error);
    return NextResponse.json(
      { error: "Error al subir la foto de retiro." },
      { status: 500 },
    );
  }
}
