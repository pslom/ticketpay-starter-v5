export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { queryCitationsByPlate } from "@/lib/sfdata";

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const out: any[] = [];
  const { data: subs, error } = await s.from("subscriptions").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  for (const sub of subs || []) {
    const rows = await queryCitationsByPlate({
      plate: sub.plate,
      state: sub.state,
      since: "1970-01-01T00:00:00.000Z",
      limit: 50
    });
    out.push({
      sub: { id: sub.id, plate: sub.plate, state: sub.state },
      matches_found: rows.length,
      ids: rows.map(r => r.citation_number)
    });
  }
  return NextResponse.json({ items: out });
}
