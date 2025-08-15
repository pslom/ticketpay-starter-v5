export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { getPool } from '../../../lib/pg';
import { j, corsHeaders } from '../../../lib/response';
import { z } from 'zod';

const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const bodySchema = z.object({ id: z.string().optional().nullable() });

async function handle(req: NextRequest, id: string) {
  try {
    const safe = (id || '').trim();
    // Idempotent UX: empty/invalid IDs are treated as already unsubscribed
    if (!safe || !UUID_RE.test(safe)) return j(req, 200, { ok:true, removed:0, note:'invalid_or_empty_id' });

    const pool = getPool();
    const client = await pool.connect();
    try {
      const r = await client.query('DELETE FROM public.subscriptions WHERE id=$1::uuid RETURNING id', [safe]);
      return j(req, 200, { ok:true, removed: r.rowCount || 0 });
    } finally { client.release(); }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return j(req, 500, { ok:false, error:'server_error', detail: msg });
  }
}

export async function OPTIONS(req: NextRequest) { return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('origin') || undefined) }); }
export async function GET(req: NextRequest) { return handle(req, String(req.nextUrl.searchParams.get('id')||'')); }
export async function POST(req: NextRequest) {
  let id = '';
  try {
    const raw = await req.text();
    let parsed: unknown = {};
    try { parsed = raw ? JSON.parse(raw) : {}; } catch {}
    const res = bodySchema.safeParse(parsed);
    if (res.success) id = String(res.data.id || '');
  } catch { /* ignore */ }
  return handle(req, id);
}
