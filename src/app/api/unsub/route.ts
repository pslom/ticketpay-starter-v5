export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { getPool } from '../../../lib/pg';
import { limitPg } from '../../../lib/ratelimit-pg';
import { z } from 'zod';
import { j } from '../../../lib/response';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const bodySchema = z.object({ id: z.string().optional().nullable() });

async function handle(req: NextRequest, id: string) {
  try {
    const safe = (id || '').trim();
    // Idempotent UX: treat empty/invalid IDs as already unsubscribed
    if (!safe || !UUID_RE.test(safe)) return j(req, 200, { ok: true, removed: 0, note: 'invalid_or_empty_id' });

    const pool = getPool();
    const client = await pool.connect();
    try {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
      const gate = await limitPg(client, `rl:unsub:${ip}`, 10, 60);
      if (!gate.ok) return j(req, 429, { ok:false, error:'rate_limited', reset: gate.reset });

      const r = await client.query('DELETE FROM public.subscriptions WHERE id=$1::uuid RETURNING id', [safe]);
      return j(req, 200, { ok: true, removed: r.rowCount || 0 });
    } finally { client.release(); }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return j(req, 500, { ok: false, error: 'server_error', detail: msg });
  }
}

export async function OPTIONS(req: NextRequest) { return j(req, 204, {}); }
export async function GET(req: NextRequest) { return handle(req, String(req.nextUrl.searchParams.get('id') || '')); }
export async function POST(req: NextRequest) {
  let id = '';
  try {
    const raw = await req.text();
    // try parse JSON safely and validate with zod
    let parsed: unknown = {};
    try { parsed = raw ? JSON.parse(raw) : {}; } catch {}
    const result = bodySchema.safeParse(parsed);
    if (result.success) id = String(result.data.id || '');
  } catch { /* ignore */ }
  return handle(req, id);
}
