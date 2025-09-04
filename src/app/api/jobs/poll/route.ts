export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { fetchCitationsSince } from "@/lib/sfmta";
import { upsertAndMatch } from "@/lib/match";
import { enqueueReminders } from "@/lib/reminders";
import { getPool } from "@/lib/pg";

async function getCursor() {
  const pool = await getPool();
  const r = await pool.query(
    "select coalesce(max(date_added), now() - interval '7 days') as d from citations_sfmta"
  );
  return new Date(r.rows[0].d).toISOString();
}

export async function POST() {
  const since = await getCursor();
  const rows = await fetchCitationsSince(since);
  const { maxDate } = await upsertAndMatch(rows);
  await enqueueReminders();
  return NextResponse.json({ fetched: rows.length, last_seen: maxDate?.toISOString() || null });
}
