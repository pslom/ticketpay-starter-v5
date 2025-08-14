export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function json(status: number, body: any) {
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

type CoreBody =
  | { op: 'lookup_ticket'; plate: string; state: string; city?: string }
  | { op: 'subscribe'; plate: string; state: string; channel: 'email'|'sms'; value: string; city?: string }
  | { op: 'list_subscriptions'; plate?: string; state?: string; value?: string; channel?: 'email'|'sms'; city?: string }
  | { op: 'unsubscribe'; id: string };

async function getClient() {
  if (!process.env.DATABASE_URL) throw new Error('env_missing_DATABASE_URL');
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  const client = await pool.connect();
  return {
    client,
    async done() {
      try { client.release(); } catch {}
      try { await pool.end(); } catch {}
    }
  };
}

export async function POST(req: NextRequest) {
  let body: CoreBody;
  try { body = await req.json(); } catch { return json(400, { ok:false, error:'invalid_json' }); }
  const op = (body as any)?.op;
  if (!op) return json(400, { ok:false, error:'missing_op' });

  const city = ((body as any).city || CITY_DEFAULT).toUpperCase();

  if (op === 'lookup_ticket') {
    const plate = (body as any).plate || '';
    const state = (body as any).state || '';
    const plateNorm = normalizePlate(plate);
    const stateNorm = normalizeState(state);
    if (!plateNorm || !stateNorm) return json(400, { ok:false, error:'validation_error', detail:{ plate, state } });

    try {
      const { client, done } = await getClient();
      try {
        const q = `
          SELECT id, city, plate, state, citation_number, status, amount_cents, issued_at, location, violation, source, created_at
          FROM public.citations
          WHERE plate_normalized = $1 AND state = $2 AND city = $3
          ORDER BY issued_at DESC, created_at DESC
        `;
        const r = await client.query(q, [plateNorm, stateNorm, city]);
        return json(200, { ok:true, items: r.rows });
      } finally { await done(); }
    } catch (e:any) {
      const msg = String(e?.message||e);
      if (msg.includes('env_missing_DATABASE_URL')) return json(500, { ok:false, error:'env_missing_DATABASE_URL' });
      if (msg.includes('relation') && msg.includes('does not exist')) return json(500, { ok:false, error:'schema_missing', detail: msg });
      return json(500, { ok:false, error:'server_error', detail: msg });
    }
  }

  if (op === 'subscribe') {
    const plate = (body as any).plate || '';
    const state = (body as any).state || '';
    const channel = (body as any).channel as 'email'|'sms';
    const value = ((body as any).value || '').trim();
    const plateNorm = normalizePlate(plate);
    const stateNorm = normalizeState(state);
    if (!plateNorm || !stateNorm || !value || !['email','sms'].includes(channel)) {
      return json(400, { ok:false, error:'validation_error', detail:{ plate, state, channel, value } });
    }

    try {
      const { client, done } = await getClient();
      try {
        const ins = await client.query(
          `INSERT INTO public.subscriptions
           (plate, plate_normalized, state, channel, value, city)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT (plate_normalized, state, channel, value, city)
           DO UPDATE SET value = EXCLUDED.value
           RETURNING id`,
          [plate, plateNorm, stateNorm, channel, value, city]
        );
        const id = ins.rows[0]?.id;

        // Fire-and-forget confirmation if envs present
        try {
          const { notify } = await import('../../../lib/notify');
          const manage = `${BASE_URL}/manage`;
          const unsub  = `${BASE_URL}/unsubscribe/${id}`;
          const text =
            `TicketPay: subscribed to ${plateNorm}/${stateNorm} (${city}). Manage: ${manage} — Unsubscribe: ${unsub}`;
          if ((process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM) && channel === 'email') {
            notify({ channel:'email', to: value, subject:'TicketPay subscription', text,
                     html: `<p>${text}</p><p><a href="${unsub}">Unsubscribe</a></p>` }).catch(()=>{});
          }
          if ((process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM) && channel === 'sms') {
            notify({ channel:'sms', to: value, text }).catch(()=>{});
          }
        } catch {}

        return json(200, { ok:true, id, manage_url: `${BASE_URL}/manage` });
      } finally { await done(); }
    } catch (e:any) {
      const msg = String(e?.message||e);
      if (msg.includes('relation') && msg.includes('does not exist')) return json(500, { ok:false, error:'schema_missing', detail: msg });
      return json(500, { ok:false, error:'server_error', detail: msg });
    }
  }

  if (op === 'list_subscriptions') {
    const plate = (body as any).plate || '';
    const state = (body as any).state || '';
    const value = ((body as any).value || '').trim();
    const channel = (body as any).channel as ('email'|'sms'|undefined);

    try {
      const { client, done } = await getClient();
      try {
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
      } finally { await done(); }
    } catch (e:any) {
      const msg = String(e?.message||e);
      if (msg.includes('relation') && msg.includes('does not exist')) return json(500, { ok:false, error:'schema_missing', detail: msg });
      return json(500, { ok:false, error:'server_error', detail: msg });
    }
  }

  if (op === 'unsubscribe') {
    const id = (body as any).id || '';
    if (!id) return json(400, { ok:false, error:'validation_error', detail:{ id } });

    try {
      const { client, done } = await getClient();
      try {
        const r = await client.query(`DELETE FROM public.subscriptions WHERE id=$1 RETURNING id`, [id]);
        return json(200, { ok:true, removed: r.rowCount || 0 });
      } finally { await done(); }
    } catch (e:any) {
      const msg = String(e?.message||e);
      return json(500, { ok:false, error:'server_error', detail: msg });
    }
  }

  return json(400, { ok:false, error:'unknown_op', got: op });
}
