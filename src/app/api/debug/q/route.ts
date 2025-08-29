export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { queryCitationsByPlate } from "@/lib/sfdata";
export async function GET(req: Request) {
  const u = new URL(req.url);
  const plate = String(u.searchParams.get("plate") || "");
  const state = String(u.searchParams.get("state") || "");
  const since = u.searchParams.get("since") || new Date(Date.now() - 30*86400000).toISOString();
  if (!plate || !state) return NextResponse.json({ error: "plate and state required" }, { status: 400 });
  const rows = await queryCitationsByPlate({ plate, state, since, limit: 50 });
  return NextResponse.json({ count: rows.length, rows });
}
