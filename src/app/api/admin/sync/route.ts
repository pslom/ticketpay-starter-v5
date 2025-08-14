export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 3,
});

function json(status: number, body: any) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'x-admin-sync': 'v2',
      'access-control-allow-origin': 'https://www.ticketpay.us.com, https://ticketpay.us.com, http://localhost:3000, http://localhost:3010',
      'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'OPTIONS, POST',
    },
  });
}

export async function OPTIONS() {
  return json(204, {});
}

function normalizePlate(raw: string) {
  return (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}
function normalizeState(raw: string) {
  return (raw || '').toUpperCase().trim();
}

type Item = {
  city: string;
  plate: string;
  state: string;
  citation_number: string;
  status: string;
  amount_cents: number;
  issued_at: string;        // ISO
  location?: string | null;
  violation?: string | null;
  source?: string | null;
};

function pickItems(payload: any): Item[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as Item[];
  if (Array.isArray(payload.items)) return payload.items as Item[];
  if (payload.city && payload.plate && payload.citation_number) return [payload as Item];
  return [];
}

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) return json(500, { ok:false, error:'env_missing_DATABASE_URL' });

  const hdr = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const token = hdr.toLowerCase().startsWith('bearer ') ? hdr.slice(7).trim() : hdr.trim();
  if (!process.env.ADMIN_TOKEN) return json(500, { ok:false, error:'env_missing_ADMIN_TOKEN' });
  if (!token || token !== process.env.ADMIN_TOKEN) return json(401, { ok:false, error:'unauthorized' });

  let payload: any;
  try { payload = await req.json(); } catch { return json(400, { ok:false, error:'invalid_json' }); }

  const items = pickItems(payload);
  if (!items.length) return json(400, { ok:false, error:'no_items' });

  const prepared: Array<[
    string,string,string,string,string,string,number,string,string|null,string|null,string|null
  ]> = [];

  for (const it of items) {
    const city = (it.city || '').toUpperCase().trim();
    const plate = (it.plate || '').trim();
    const state = normalizeState(it.state);
    const citation = (it.citation_number || '').trim();
    const status = (it.status || '').trim();
    const amount = Number(it.amount_cents);
    const issued = (it.issued_at || '').trim();

    if (!city || !plate || !state || !citation || !status || !Number.isFinite(amount) || !issued) {
      return json(400, { ok:false, error:'validation_error', detail:{ city, plate, state, citation, status, amount, issued } });
    }

    prepared.push([
      city,
      plate,
      normalizePlate(plate),
      state,
      citation,
      status,
      amount,
      issued,
      it.location ?? null,
      it.violation ?? null,
      it.source ?? null
    ]);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cols = [
      'city','plate','plate_normalized','state','citation_number',
      'status','amount_cents','issued_at','location','violation','source'
    ];

    const valuesSQL: string[] = [];
    const params: any[] = [];
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
  } catch (e:any) {
    const msg = String(e?.message || e || 'unknown');
    if (msg.includes('relation') && msg.includes('does not exist')) {
      return json(500, { ok:false, error:'schema_missing', detail: msg });
    }
    if (msg.includes('invalid input syntax for type')) {
      return json(400, { ok:false, error:'bad_input', detail: msg });
    }
    return json(500, { ok:false, error:'server_error', detail: msg });
  } finally {
    client.release();
  }
}
