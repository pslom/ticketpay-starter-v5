export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getPool } from '../../../../lib/pg';
import { j } from '../../../../lib/response';
import { readAdminToken } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  const token = readAdminToken(req);
  if (!process.env.ADMIN_TOKEN) return j(req, 500, { ok:false, error:'env_missing_ADMIN_TOKEN' });
  if (!token || token !== process.env.ADMIN_TOKEN) return j(req, 401, { ok:false, error:'unauthorized' });
  if (!process.env.DATABASE_URL) return j(req, 500, { ok:false, error:'env_missing_DATABASE_URL' });

  const pool = getPool();
  const client = await pool.connect();
  try {
    const ping = await client.query('select 1 as one');
    const hasCitations = await client.query("select to_regclass('public.citations') as tbl");
    const hasSubs = await client.query("select to_regclass('public.subscriptions') as tbl");
    return j(req, 200, {
      ok: true,
      db: 'online',
      ping: ping.rows[0].one,
      citations: hasCitations.rows[0].tbl,
      subscriptions: hasSubs.rows[0].tbl
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return j(req, 500, { ok:false, error:'db_error', detail: msg });
  } finally {
    try { client.release(); } catch {}
  }
}
