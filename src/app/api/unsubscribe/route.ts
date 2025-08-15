export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/pg';

const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ORIGINS = [
  'https://www.ticketpay.us.com',
  'https://ticketpay.us.com',
  'http://localhost:3000',
  'http://localhost:3010'
];

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const allow = ORIGINS.includes(origin) ? origin : 'https://ticketpay.us.com';
  return {
    'content-type':'application/json',
    'x-unsub-ver':'v3',
    'access-control-allow-origin': allow,
    'access-control-allow-headers':'content-type, authorization',
    'access-control-allow-methods':'OPTIONS, GET, POST',
    'access-control-max-age':'86400'
  } as Record<string,string>;
}

function j(req: NextRequest, status: number, body: any) {
  return new NextResponse(JSON.stringify(body), { status, headers: corsHeaders(req) });
}

async function handle(req: NextRequest, id: string) {
  try {
    const safe = (id || '').trim();
    // Treat empty/invalid IDs as already-unsubscribed (idempotent UX)
    if (!safe || !UUID_RE.test(safe)) return j(req, 200, { ok:true, removed:0, note:'invalid_or_empty_id' });

    const pool = getPool();
    const client = await pool.connect();
    try {
      const r = await client.query('DELETE FROM public.subscriptions WHERE id=$1::uuid RETURNING id', [safe]);
      return j(req, 200, { ok:true, removed: r.rowCount || 0 });
    } finally {
      client.release();
    }
  } catch (e:any) {
    return j(req, 500, { ok:false, error:'server_error', detail:String(e?.message||e) });
  }
}

export async function OPTIONS(req: NextRequest) { return j(req, 204, {}); }

export async function POST(req: NextRequest) {
  let id = '';
  try { const b = await req.json(); id = String(b?.id || ''); } catch {}
  return handle(req, id);
}

export async function GET(req: NextRequest) {
  const id = String(req.nextUrl.searchParams.get('id') || '');
  return handle(req, id);
}
