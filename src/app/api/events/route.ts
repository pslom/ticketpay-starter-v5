export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getPool } from "@/lib/pg";

export async function POST(req: Request) {
  const { event, payload, sessionId, userRef } = await req.json();
  if (!event) return NextResponse.json({ ok: false, error: "missing event" }, { status: 400 });

  const pool = await getPool();
  await pool.query(
    `insert into events (session_id, user_ref, event, payload) values ($1,$2,$3,$4)`,
    [sessionId ?? null, userRef ?? null, event, payload ?? {}]
  );
  return NextResponse.json({ ok: true });
}
