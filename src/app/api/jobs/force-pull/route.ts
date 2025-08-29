export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { fetchRecent } from "@/lib/sfmta";
import { upsertAndMatch } from "@/lib/match";

export async function POST() {
  const rows = await fetchRecent(500);
  const { maxDate } = await upsertAndMatch(rows);
  return NextResponse.json({ fetched: rows.length, last_seen: maxDate?.toISOString() || null });
}
