import { NextResponse } from "next/server";
import {
  ChildAlreadyDeliveredError,
  ChildNotFoundError,
  InvalidRetiroPayloadError,
  registerChildRetiro,
} from "@/services";
import type { RetiroPayload } from "@/types/child";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as RetiroPayload;
    const child = await registerChildRetiro(id, body);
    return NextResponse.json(child);
  } catch (error) {
    if (error instanceof InvalidRetiroPayloadError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof ChildNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof ChildAlreadyDeliveredError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("PATCH /api/ninos/[id]/retiro:", error);
    return NextResponse.json(
      { error: "Error al registrar el retiro" },
      { status: 500 },
    );
  }
}
