import { NextResponse } from "next/server";
import { getChildrenStatusByIds } from "@/services";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { ids?: string[] };
    const ids = Array.isArray(body.ids) ? body.ids : [];
    const children = await getChildrenStatusByIds(ids);
    return NextResponse.json({ children });
  } catch (error) {
    console.error("POST /api/ninos/estado:", error);
    return NextResponse.json(
      { error: "No se pudo consultar el estado" },
      { status: 500 },
    );
  }
}
