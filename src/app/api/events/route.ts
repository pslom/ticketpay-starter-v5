export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPool } from "@/lib/pg";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));

    // Accept multiple shapes:
    // 1) { name, props, session_id, user_id }
    // 2) { event, payload, sessionId, userRef }           // your existing callers
    // 3) { event: "name", props, session_id, user_id }
    // 4) { event: { name, props, session_id, user_id } }

    const name =
      body?.name ??
      (typeof body?.event === "string" ? body.event : body?.event?.name);

    const sessionId =
      body?.sessionId ??
      body?.session_id ??
      (typeof body?.event === "object" ? body.event?.session_id : undefined);

    const userRef =
      body?.userRef ??
      body?.user_id ??
      (typeof body?.event === "object" ? body.event?.user_id : undefined);

    const payload =
      body?.payload ??
      body?.props ??
      (typeof body?.event === "object" ? body.event?.props : undefined) ??
      {};

    if (!name || typeof name !== "string") {
      return NextResponse.json({ ok: false, error: "missing event" }, { status: 400 });
    }

    const pool = getPool();
    // Detect target schema to support both legacy and new columns
    const colsRes = await pool.query(
      `select column_name from information_schema.columns
       where table_schema='public' and table_name='events'`
    );
    const cols = new Set(colsRes.rows.map((r: any) => r.column_name));
    if (cols.has('name') && cols.has('props')) {
      // New schema: id, name, session_id, user_id, props, created_at
      await pool.query(
        `insert into public.events (name, session_id, user_id, props)
         values ($1,$2,$3,$4::jsonb)`,
        [name, sessionId ?? null, userRef ?? null, JSON.stringify(payload)]
      );
    } else {
      // Legacy schema: event, payload, user_ref
      await pool.query(
        `insert into public.events (session_id, user_ref, event, payload)
         values ($1,$2,$3,$4::jsonb)`,
        [sessionId ?? null, userRef ?? null, name, JSON.stringify(payload)]
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log the real error to server logs (visible in `npm run dev` and `vercel logs`)
    console.error("[/api/events] error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
