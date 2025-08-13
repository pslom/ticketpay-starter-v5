import { NextRequest } from "next/server";
import { getPool } from "@/lib/db";
import { subscribeSchema } from "@/lib/validate";
import { CITY_DEFAULT, normalizePlate, normalizeState } from "@/lib/normalizers";
import { sendSms, sendEmail } from "@/lib/notify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });
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

    const createdId: string | null = rows[0]?.id ?? null;
    const deduped = !createdId;

    if (createdId) {
      const base = process.env.BASE_URL || req.headers.get("origin") || "http://localhost:3010";
      const unsubLink = `${base.replace(/\/$/, "")}/unsubscribe/${createdId}`;
      const msg = `TicketPay: You subscribed for ${plate}/${stateNorm}. Unsubscribe: ${unsubLink}`;
      if (channel === "sms") {
        await sendSms(value, msg);
      } else {
        await sendEmail(value, "TicketPay subscription confirmed", `<p>${msg}</p>`);
      }
    }

    return Response.json({ ok: true, id: createdId, deduped });
  } catch {
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
