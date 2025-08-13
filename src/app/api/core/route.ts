export const runtime = 'nodejs';
import { NextRequest } from "next/server";
import { z } from "zod";
import { getPool } from "@/lib/db";
import { CITY_DEFAULT, normalizePlate, normalizeState } from "@/lib/normalizers";
import { sendSms, sendEmail } from "@/lib/notify";
import { corsHeaders } from "@/lib/cors";

const lookupSchema = z.object({ plate: z.string().min(2).max(12), state: z.string().min(2).max(3), city: z.string().optional() });
const subscribeSchema = z.object({ plate: z.string().min(2).max(12), state: z.string().min(2).max(3), channel: z.enum(["sms","email"]), value: z.string().min(3).max(255), city: z.string().optional() });
const listSchema = z.object({ plate: z.string().min(2).max(12), state: z.string().min(2).max(3), city: z.string().optional() });
const unsubscribeSchema = z.object({ subscription_id: z.string().uuid() });

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || undefined;
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || undefined;
  const pool = getPool();
  try {
    const body = await req.json();
    const op = String(body?.op || '').trim();

    if (op === 'lookup_ticket') {
      const parsed = lookupSchema.safeParse(body);
      if (!parsed.success) return Response.json({ ok:false, error:'invalid_input' }, { status:400, headers: corsHeaders(origin) });
      const { plate, state, city } = parsed.data;
      const plateNorm = normalizePlate(plate);
      const stateNorm = normalizeState(state);
      const cityUse = (city || CITY_DEFAULT).toUpperCase();
      const { rows } = await pool.query(
        "SELECT id, citation_number, status, amount_cents, issued_at, location, violation, city FROM citations WHERE plate_normalized=$1 AND state=$2 AND city=$3 ORDER BY issued_at DESC",
        [plateNorm, stateNorm, cityUse]
      );
      return Response.json({ ok:true, tickets: rows }, { headers: corsHeaders(origin) });
    }

    if (op === 'subscribe') {
      const parsed = subscribeSchema.safeParse(body);
      if (!parsed.success) return Response.json({ ok:false, error:'invalid_input' }, { status:400, headers: corsHeaders(origin) });
      const { plate, state, channel, value, city } = parsed.data;
      const plateNorm = normalizePlate(plate);
      const stateNorm = normalizeState(state);
      const cityUse = (city || CITY_DEFAULT).toUpperCase();
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
        if (channel === 'sms') await sendSms(value, msg); else await sendEmail(value, 'TicketPay subscription confirmed', `<p>${msg}</p>`);
      }
      return Response.json({ ok:true, id: createdId, deduped }, { headers: corsHeaders(origin) });
    }

    if (op === 'list_subscriptions') {
      const parsed = listSchema.safeParse(body);
      if (!parsed.success) return Response.json({ ok:false, error:'invalid_input' }, { status:400, headers: corsHeaders(origin) });
      const { plate, state, city } = parsed.data;
      const plateNorm = normalizePlate(plate);
      const stateNorm = normalizeState(state);
      const cityUse = (city || CITY_DEFAULT).toUpperCase();
      const { rows } = await pool.query(
        "SELECT id, channel, value, created_at, city FROM subscriptions WHERE plate_normalized=$1 AND state=$2 AND city=$3 ORDER BY created_at DESC",
        [plateNorm, stateNorm, cityUse]
      );
      return Response.json({ ok:true, subscriptions: rows }, { headers: corsHeaders(origin) });
    }

    if (op === 'unsubscribe') {
      const parsed = unsubscribeSchema.safeParse(body);
      if (!parsed.success) return Response.json({ ok:false, error:'invalid_input' }, { status:400, headers: corsHeaders(origin) });
      const { subscription_id } = parsed.data;
      const result = await pool.query("DELETE FROM subscriptions WHERE id = $1", [subscription_id]);
      return Response.json({ ok:true, deleted: result.rowCount }, { headers: corsHeaders(origin) });
    }

    return Response.json({ ok:false, error:'unknown_op' }, { status:400, headers: corsHeaders(origin) });
  } catch (e) {
    return Response.json({ ok:false, error:'server_error' }, { status:500, headers: corsHeaders(origin) });
  }
}
