export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getPool } from "@/lib/pg";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  if (!process.env.DEBUG_TOKEN || token !== process.env.DEBUG_TOKEN) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit") || 10)));
  try {
    const pool = getPool();
    const colsRes = await pool.query(
      `select column_name from information_schema.columns
       where table_schema='public' and table_name='events'`
    );
    const cols = new Set(colsRes.rows.map((r: any) => r.column_name));
    let q;
    if (cols.has('name') && cols.has('props')) {
      q = `select id, name, session_id, user_id, props, created_at
           from public.events
           order by created_at desc
           limit $1`;
    } else {
      // Legacy: event, payload, user_ref
      q = `select id,
                  event   as name,
                  session_id,
                  null::uuid as user_id,
                  payload as props,
                  created_at
           from public.events
           order by created_at desc
           limit $1`;
    }
    const r = await pool.query(q, [limit]);
    return NextResponse.json({ ok: true, items: r.rows });
  } catch (err: any) {
    console.error("[/api/debug/events/list] error:", err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
