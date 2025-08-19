export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getPool } from "@/lib/pg";
import { getIncomingToken, getExpectedToken } from "../_util/token";

export async function GET(req: Request) {
  const token = getIncomingToken(req);
  const expected = getExpectedToken();
  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  try {
    const r = await getPool().query("select 1 as ok");
    return NextResponse.json({ ok: true, result: r.rows[0] });
  } catch (err: any) {
    console.error("[/api/debug/db] error:", err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
