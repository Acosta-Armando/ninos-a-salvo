import { NextResponse } from "next/server";
import {
  InvalidChildPayloadError,
  upsertChild,
} from "@/services";
import type { ChildPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChildPayload;
    const child = await upsertChild(body);
    return NextResponse.json(child);
  } catch (error) {
    if (error instanceof InvalidChildPayloadError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("POST /api/ninos:", error);
    return NextResponse.json(
      { error: "Error al guardar el registro" },
      { status: 500 },
    );
  }
}
