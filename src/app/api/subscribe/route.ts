import { NextRequest } from "next/server";
import { getPool } from "@/lib/db";
import { subscribeSchema } from "@/lib/validate";
import { CITY_DEFAULT, normalizePlate, normalizeState } from "@/lib/normalizers";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || undefined;
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || undefined;
  try {
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: "invalid_input" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }
    const { plate, state, channel, value, city } = parsed.data;
    const plateNorm = normalizePlate(plate);
    const stateNorm = normalizeState(state);
    const cityUse = (city || CITY_DEFAULT).toUpperCase();

    const pool = getPool();
    const { rows } = await pool.query(
      "INSERT INTO subscriptions (plate, plate_normalized, state, channel, value, city) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (plate_normalized, state, channel, value, city) DO NOTHING RETURNING id",
      [plate, plateNorm, stateNorm, channel, value, cityUse]
    );

    return Response.json(
      { ok: true, id: rows[0]?.id ?? null, deduped: rows.length === 0 },
      { headers: corsHeaders(origin) }
    );
  } catch {
    return Response.json(
      { ok: false, error: "server_error" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
