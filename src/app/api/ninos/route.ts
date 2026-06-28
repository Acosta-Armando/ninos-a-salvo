import { NextResponse } from "next/server";
import {
  InvalidChildPayloadError,
  upsertChild,
} from "@/services";
import type { ChildPayload } from "@/types/child";

function apiErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Error desconocido";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChildPayload;
    const child = await upsertChild(body);
    return NextResponse.json(child);
  } catch (error) {
    if (error instanceof InvalidChildPayloadError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const message = apiErrorMessage(error);
    console.error("POST /api/ninos:", error);

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? message
            : "Error al guardar el registro",
      },
      { status: 500 },
    );
  }
}
