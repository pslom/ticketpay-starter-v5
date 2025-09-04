export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { runDailyPoll } from "@/lib/jobs";

export async function POST() {
  try {
    const result = await runDailyPoll();
    return NextResponse.json({ ok: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: String(error?.message || error) }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
