import { NextResponse } from "next/server";
import {
  ChildAlreadyDeliveredError,
  ChildNotFoundError,
  InvalidManageTokenError,
  markChildReencontrado,
} from "@/services";
import type { ReencontradoPayload } from "@/types/mis-registros";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as ReencontradoPayload;
    const child = await markChildReencontrado(id, body.manage_token);
    return NextResponse.json({ id: child.id, status: child.status });
  } catch (error) {
    if (error instanceof InvalidManageTokenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof ChildNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof ChildAlreadyDeliveredError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("PATCH /api/ninos/[id]/reencontrado:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el registro" },
      { status: 500 },
    );
  }
}
