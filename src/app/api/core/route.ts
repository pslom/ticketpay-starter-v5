export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { limitPg } from '../../../lib/ratelimit-pg';
import { getPool } from '../../../lib/pg';

function json(status: number, body: unknown) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': 'https://www.ticketpay.us.com, https://ticketpay.us.com, http://localhost:3000, http://localhost:3010',
      'access-control-allow-headers': 'content-type, authorization, x-admin-token',
      'access-control-allow-methods': 'OPTIONS, POST',
    },
  });
}
export async function OPTIONS() { return json(204, {}); }

const CITY_DEFAULT = (process.env.CITY_DEFAULT || 'SF').toUpperCase();
const BASE_URL = process.env.BASE_URL || 'https://www.ticketpay.us.com';

function normalizePlate(raw: string) { return (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
function normalizeState(raw: string) { return (raw || '').toUpperCase().trim(); }

// CoreBody type intentionally omitted to avoid unused-type lint warnings; payload is validated inline.

async function getClient() {
  const pool = getPool();
  const client = await pool.connect();
  return { client, async done() { try { client.release(); } catch {} } };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const url = new URL(req.url);
  const pathKey = url.pathname.replace(/\W+/g, ':');

  let rawBody: unknown;
  try { rawBody = await req.json(); } catch { return json(400, { ok:false, error:'invalid_json' }); }
  const payload = (typeof rawBody === 'object' && rawBody !== null) ? (rawBody as Record<string, unknown>) : {};
  const op = String(payload.op || '');
  if (!op) return json(400, { ok:false, error:'missing_op' });

  const city = String(payload.city || CITY_DEFAULT).toUpperCase();

  let clientWrap;
  try {
    clientWrap = await getClient();
    const { client } = clientWrap;
    const baseKey = `rl:${pathKey}:${ip}`;

    if (op === 'lookup_ticket') {
      const gate = await limitPg(client, `${baseKey}:lookup`, 20, 60);
      if (!gate.ok) return json(429, { ok:false, error:'rate_limited', reset: gate.reset });

      const plate = String(payload.plate || '');
      const state = String(payload.state || '');
      const plateNorm = normalizePlate(plate);
      const stateNorm = normalizeState(state);
      if (!plateNorm || !stateNorm) return json(400, { ok:false, error:'validation_error', detail:{ plate, state } });

      const q = `
        SELECT id, city, plate, state, citation_number, status, amount_cents, issued_at, location, violation, source, created_at
        FROM public.citations
        WHERE plate_normalized = $1 AND state = $2 AND city = $3
        ORDER BY issued_at DESC, created_at DESC
      `;
      const r = await client.query(q, [plateNorm, stateNorm, city]);
      return json(200, { ok:true, items: r.rows });
    }

    if (op === 'subscribe') {
      const gate = await limitPg(client, `${baseKey}:subscribe`, 10, 60);
      if (!gate.ok) return json(429, { ok:false, error:'rate_limited', reset: gate.reset });

      const plate = String(payload.plate || '');
      const state = String(payload.state || '');
      const channel = String(payload.channel || '') as 'email'|'sms';
      const value = String(payload.value || '').trim();
      const plateNorm = normalizePlate(plate);
      const stateNorm = normalizeState(state);
      if (!plateNorm || !stateNorm || !value || !['email','sms'].includes(channel)) {
        return json(400, { ok:false, error:'validation_error', detail:{ plate, state, channel, value } });
      }

      const ins = await client.query(
        `INSERT INTO public.subscriptions
         (plate, plate_normalized, state, channel, value, city)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (plate_normalized, state, channel, value, city)
         DO NOTHING
         RETURNING id`,
        [plate, plateNorm, stateNorm, channel, value, city]
      );
      let id = ins.rows[0]?.id as string|undefined;
      let deduped = false;
      if (!id) {
        deduped = true;
        const sel = await client.query(
          `SELECT id FROM public.subscriptions
           WHERE plate_normalized=$1 AND state=$2 AND channel=$3 AND value=$4 AND city=$5
           LIMIT 1`,
          [plateNorm, stateNorm, channel, value, city]
        );
        id = sel.rows[0]?.id;
      }

      try {
        const mod = await import('../../../lib/notify');
        const notifier = (mod && typeof mod.createNotifier === 'function') ? mod.createNotifier() : null;
        const manage = `${BASE_URL}/manage`;
        const unsub  = `${BASE_URL}/unsubscribe/${id}`;
        const text = `TicketPay: subscribed to ${plateNorm}/${stateNorm} (${city}). Manage: ${manage} — Unsubscribe: ${unsub}`;
        if ((process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM) && channel === 'email' && notifier) {
          notifier.notify({ channel:'email', to: value, subject:'TicketPay subscription', text,
                   html: `<p>${text}</p><p><a href="${unsub}">Unsubscribe</a></p>` }).catch(()=>{});
        }
        if ((process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM) && channel === 'sms' && notifier) {
          notifier.notify({ channel:'sms', to: value, text }).catch(()=>{});
        }
      } catch {}

      return json(200, { ok:true, id: id ?? null, manage_url: `${BASE_URL}/manage`, deduped });
    }

    if (op === 'list_subscriptions') {
      const gate = await limitPg(client, `${baseKey}:list`, 20, 60);
      if (!gate.ok) return json(429, { ok:false, error:'rate_limited', reset: gate.reset });

      const plate = String(payload.plate || '');
      const state = String(payload.state || '');
      const value = String(payload.value || '').trim();
      const channel = String(payload.channel || '') as ('email'|'sms'|undefined);

      let r;
      if (value) {
        r = await client.query(
          `SELECT * FROM public.subscriptions WHERE value=$1 ${channel ? 'AND channel=$2' : ''} ORDER BY created_at DESC`,
          channel ? [value, channel] : [value]
        );
      } else {
        const plateNorm = normalizePlate(plate);
        const stateNorm = normalizeState(state);
        if (!plateNorm || !stateNorm) return json(400, { ok:false, error:'validation_error', detail:{ plate, state } });
        r = await client.query(
          `SELECT * FROM public.subscriptions WHERE plate_normalized=$1 AND state=$2 AND city=$3 ORDER BY created_at DESC`,
          [plateNorm, stateNorm, city]
        );
      }
      return json(200, { ok:true, items: r.rows });
    }

    if (op === 'unsubscribe') {
      const id = String(payload.id || '');
      if (!id) return json(400, { ok:false, error:'validation_error', detail:{ id } });

      const gate = await limitPg(client, `${baseKey}:unsubscribe`, 5, 60);
      if (!gate.ok) return json(429, { ok:false, error:'rate_limited', reset: gate.reset });

      const r = await client.query(`DELETE FROM public.subscriptions WHERE id=$1 RETURNING id`, [id]);
      return json(200, { ok:true, removed: r.rowCount || 0 });
    }

    return json(400, { ok:false, error:'unknown_op', got: op });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('env_missing_DATABASE_URL')) return json(500, { ok:false, error:'env_missing_DATABASE_URL' });
    if (msg.includes('relation') && msg.includes('does not exist')) return json(500, { ok:false, error:'schema_missing', detail: msg });
    return json(500, { ok:false, error:'server_error', detail: msg });
  } finally {
    try { await clientWrap?.done(); } catch {}
  }
}
