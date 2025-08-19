export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getPool } from "@/lib/pg";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  if (!process.env.DEBUG_TOKEN || token !== process.env.DEBUG_TOKEN) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  try {
    const r = await getPool().query("select 1 as ok");
    return NextResponse.json({ ok: true, result: r.rows[0] });
  } catch (err: any) {
    console.error("[/api/_debug/db] error:", err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
