import { NextResponse } from "next/server";
import { getTotalRegistrosCount } from "@/services";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const total = await getTotalRegistrosCount();
    return NextResponse.json({ total });
  } catch (error) {
    console.error("GET /api/stats/registros:", error);
    return NextResponse.json({ total: 0 });
  }
}
