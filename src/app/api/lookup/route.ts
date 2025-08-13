import { NextRequest } from "next/server";
import { getPool } from "@/lib/db";
import { lookupSchema } from "@/lib/validate";
import { CITY_DEFAULT, normalizePlate, normalizeState } from "@/lib/normalizers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = lookupSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });
    }
    const { plate, state, city } = parsed.data;
    const plateNorm = normalizePlate(plate);
    const stateNorm = normalizeState(state);
    const cityUse = (city || CITY_DEFAULT).toUpperCase();

    const pool = getPool();
    const { rows } = await pool.query(
      "SELECT id, citation_number, status, amount_cents, issued_at, location, violation, city FROM citations WHERE plate_normalized = $1 AND state = $2 AND city = $3 ORDER BY issued_at DESC",
      [plateNorm, stateNorm, cityUse]
    );

    return Response.json({ ok: true, tickets: rows });
  } catch {
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
