export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { sfLookupByPlate, sfLookupByCitation, deriveDueEstimate } from "@/lib/sfTickets";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const plate = sp.get("plate")?.trim();
    const state = sp.get("state")?.trim() || undefined;
    const citation = sp.get("citation")?.trim() || undefined;

    if (!plate && !citation) return NextResponse.json({ ok: false, error: "missing_params" }, { status: 400 });

    const rows = citation ? await sfLookupByCitation(citation) : await sfLookupByPlate(String(plate), state);
    const first = rows[0] as Record<string, unknown> | undefined;
    const dates = first ? deriveDueEstimate(first) : { estimated: true as const };

    return NextResponse.json({ ok: true, rows, ...dates });
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}