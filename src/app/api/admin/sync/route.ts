export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPool } from '../../../../lib/pg';
import { normalizePlate, normalizeState, CITY_DEFAULT } from '../../../../lib/normalizers';

function json(status: number, body: unknown) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'x-admin-sync': 'v2',
      'access-control-allow-origin': 'https://www.ticketpay.us.com, https://ticketpay.us.com, http://localhost:3000, http://localhost:3010',
      'access-control-allow-headers': 'authorization, x-admin-token, content-type',
      'access-control-allow-methods': 'OPTIONS, POST',
    },
  });
}
export async function OPTIONS() { return json(204, {}); }

// Zod schema for a single citation item
const ItemSchema = z.object({
  city: z.string().min(1).transform((s) => String(s).toUpperCase().trim()),
  plate: z.string().min(1).transform((s) => String(s).trim()),
  state: z.string().min(1).transform((s) => String(s).toUpperCase().trim()),
  citation_number: z.string().min(1).transform((s) => String(s).trim()),
  status: z.string().min(1).transform((s) => String(s).trim()),
  amount_cents: z.preprocess((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  }, z.number()),
  issued_at: z.string().min(1).transform((s) => String(s).trim()),
  location: z.string().nullable().optional(),
  violation: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) return json(500, { ok:false, error:'env_missing_DATABASE_URL' });

  // auth
  const qtok = req.nextUrl.searchParams.get('token')?.trim() || '';
  const h1 = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const bearer = h1.toLowerCase().startsWith('bearer ') ? h1.slice(7).trim() : '';
  const h2 = req.headers.get('x-admin-token')?.trim() || '';
  const token = bearer || h2 || qtok || '';

  if (!process.env.ADMIN_TOKEN) return json(500, { ok:false, error:'env_missing_ADMIN_TOKEN' });
  if (!token || token !== process.env.ADMIN_TOKEN) return json(401, { ok:false, error:'unauthorized' });

  let payload: unknown;
  try { payload = await req.json(); } catch { return json(400, { ok:false, error:'invalid_json' }); }

  // Accept array, { items: [...] } or single item
  let rawItems: unknown[] = [];
  const payloadObj = (typeof payload === 'object' && payload !== null) ? (payload as Record<string, unknown>) : undefined;
  if (Array.isArray(payload)) rawItems = payload;
  else if (payloadObj && Array.isArray(payloadObj.items)) rawItems = payloadObj.items as unknown[];
  else if (payloadObj && 'city' in payloadObj && 'plate' in payloadObj && 'citation_number' in payloadObj) rawItems = [payloadObj];

  if (!rawItems.length) return json(400, { ok:false, error:'no_items' });

  const prepared: Array<[string,string,string,string,string,string,number,string,string|null,string|null,string|null]> = [];

  for (const it of rawItems) {
    const parsed = ItemSchema.safeParse(it);
    if (!parsed.success) {
      return json(400, { ok:false, error:'validation_error', detail: parsed.error.format() });
    }
    const p = parsed.data;
    const city = String(p.city).toUpperCase().trim() || CITY_DEFAULT;
    const plate = String(p.plate).trim();
    const state = normalizeState(p.state);
    const citation = String(p.citation_number).trim();
    const status = String(p.status).trim();
    const amount = Number(p.amount_cents);
    const issued = String(p.issued_at).trim();

    prepared.push([ city, plate, normalizePlate(plate), state, citation, status, amount, issued, p.location ?? null, p.violation ?? null, p.source ?? null ]);
  }

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cols = ['city','plate','plate_normalized','state','citation_number','status','amount_cents','issued_at','location','violation','source'];
    const valuesSQL: string[] = [];
    const params: unknown[] = [];
    prepared.forEach((row, i) => {
      const base = i * row.length;
      valuesSQL.push(`(${row.map((_, j) => `$${base + j + 1}`).join(',')})`);
      params.push(...row);
    });
    const sql = `
      INSERT INTO public.citations (${cols.join(',')})
      VALUES ${valuesSQL.join(',')}
      ON CONFLICT (plate_normalized, state, citation_number, city)
      DO UPDATE SET
        status = EXCLUDED.status,
        amount_cents = EXCLUDED.amount_cents,
        issued_at = EXCLUDED.issued_at,
        location = EXCLUDED.location,
        violation = EXCLUDED.violation,
        source = EXCLUDED.source
      RETURNING (xmax = 0) AS inserted;
    `;
    const r = await client.query<{ inserted: boolean }>(sql, params);
    const inserted = r.rows.filter(x => x.inserted).length;
    const total = (r.rowCount ?? r.rows.length);
    const updated = total - inserted;
    await client.query('COMMIT');
    return json(200, { ok:true, inserted, updated });
  } catch (e: unknown) {
    try { await client.query('ROLLBACK'); } catch {}
    const errObj = e instanceof Error ? e : new Error(String(e ?? 'unknown'));
    console.error('ADMIN_SYNC_ERROR', errObj.message);
    const msg = String(errObj.message || 'unknown');
    if (msg.includes('relation') && msg.includes('does not exist')) return json(500, { ok:false, error:'schema_missing', detail: msg });
    if (msg.includes('invalid input syntax for type')) return json(400, { ok:false, error:'bad_input', detail: msg });
    return json(500, { ok:false, error:'db_error', detail: msg });
  } finally {
    try { client.release(); } catch {}
  }
}
