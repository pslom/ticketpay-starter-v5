import { NextRequest } from "next/server";
import { getPool } from "@/lib/db";
import { unsubscribeSchema } from "@/lib/validate";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || undefined;
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || undefined;
  try {
    const body = await req.json();
    const parsed = unsubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: "invalid_input" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }
    const { subscription_id } = parsed.data;

    const pool = getPool();
    const result = await pool.query("DELETE FROM subscriptions WHERE id = $1", [subscription_id]);

    return Response.json({ ok: true, deleted: result.rowCount }, { headers: corsHeaders(origin) });
  } catch {
    return Response.json(
      { ok: false, error: "server_error" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
