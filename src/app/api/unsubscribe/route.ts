import { NextRequest } from "next/server";
import { getPool } from "@/lib/db";
import { unsubscribeSchema } from "@/lib/validate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = unsubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });
    }
    const { subscription_id } = parsed.data;

    const pool = getPool();
    const result = await pool.query("DELETE FROM subscriptions WHERE id = $1", [subscription_id]);

    return Response.json({ ok: true, deleted: result.rowCount });
  } catch {
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
