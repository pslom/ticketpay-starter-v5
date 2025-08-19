// src/lib/alerts.ts
import { getPool } from "@/lib/pg";

type EnqueueInput = {
  subscriptionId: string;
  plate?: string;
  state?: string;
  email?: string;
  phone?: string;
  method?: "email" | "sms" | "both" | string;
};

type LookupResp = {
  ok?: boolean;
  dueAt?: string;
  lateFeeAt?: string;
  issuedAt?: string;
  estimated?: boolean;
};

function parseISO(s?: string) { return s ? new Date(s) : undefined; }
function minusDays(d: Date, days: number) { return new Date(d.getTime() - days * 24 * 60 * 60 * 1000); }

async function lookupTicket(plate?: string, state?: string) {
  if (!plate) return {} as LookupResp;
  const base = process.env.BASE_URL || "http://127.0.0.1:3000";
  const u = new URL(`${base}/api/tickets/sf/lookup`);
  u.searchParams.set("plate", plate);
  if (state) u.searchParams.set("state", state);
  const r = await fetch(u, { cache: "no-store" });
  return (await r.json().catch(() => ({}))) as LookupResp;
}

// Create two alerts by default:
//  - 'posted': soon after signup
//  - 'pre_late_fee_2d': 2 days before late fee if we can estimate it
export async function enqueueDefaultAlertsForSubscription(input: EnqueueInput) {
  const pool = getPool();
  const t = await lookupTicket(input.plate, input.state);

  const issuedAt = parseISO(t.issuedAt);
  const lateFeeAt = parseISO(t.lateFeeAt);

  const now = new Date();
  const soon = new Date(now.getTime() + 10 * 60 * 1000); // 10 min
  const oneHour = new Date(now.getTime() + 60 * 60 * 1000);

  const payload = {
    plate: input.plate, state: input.state,
    email: input.email, phone: input.phone, method: input.method,
    issuedAt: t.issuedAt || null,
    lateFeeAt: t.lateFeeAt || null,
    dueAt: t.dueAt || null,
  } as const;

  const rows: Array<{ type: string; at: Date; channel?: string }> = [];

  // posted: schedule in ~10 minutes (or 1h if we don't know issuance time)
  rows.push({ type: "posted", at: issuedAt && issuedAt < now ? soon : oneHour, channel: (input.method || "") as any });

  // 2d before late fee if available
  if (lateFeeAt) {
    const when = minusDays(lateFeeAt, 2);
    if (when > now) rows.push({ type: "pre_late_fee_2d", at: when, channel: (input.method || "") as any });
  }

  if (!rows.length) return;

  for (const r of rows) {
    await pool.query(
      `insert into public.subscription_alerts
        (subscription_id, alert_type, scheduled_at, channel, payload)
       values ($1,$2,$3,$4,$5::jsonb)`,
      [input.subscriptionId, r.type, r.at.toISOString(), r.channel || null, JSON.stringify(payload)]
    );
  }
}
