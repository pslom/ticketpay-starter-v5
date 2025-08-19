export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getPool } from "@/lib/pg";
import { getIncomingToken, getExpectedToken } from "../_util/token";

export async function POST(req: Request) {
  const token = getIncomingToken(req);
  const expected = getExpectedToken();
  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  try {
    const pool = getPool();
    // Detect schema shape
    const colsRes = await pool.query(
      `select column_name from information_schema.columns
       where table_schema='public' and table_name='events'`
    );
    const cols = new Set(colsRes.rows.map((r: any) => r.column_name));
    let r;
    if (cols.has("name") && cols.has("props")) {
      r = await pool.query(
        `insert into public.events (name, session_id, user_id, props)
         values ($1,$2,$3,$4::jsonb)
         returning id`,
        ["debug_insert", "debug-sid", null, JSON.stringify({ ts: Date.now() })]
      );
    } else {
      r = await pool.query(
        `insert into public.events (session_id, user_ref, event, payload)
         values ($1,$2,$3,$4::jsonb)
         returning id`,
        ["debug-sid", "debug-user", "debug_insert", JSON.stringify({ ts: Date.now() })]
      );
    }
    return NextResponse.json({ ok: true, id: r.rows[0]?.id ?? null });
  } catch (err: any) {
    console.error("[/api/debug/events-insert] error:", err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
