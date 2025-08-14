export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

function j(status: number, body: any) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

function readToken(req: NextRequest): string {
  const q = req.nextUrl.searchParams.get('token')?.trim() || '';
  const h1 = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const bearer = h1.toLowerCase().startsWith('bearer ') ? h1.slice(7).trim() : '';
  const h2 = req.headers.get('x-admin-token')?.trim() || '';
  return bearer || h2 || q || '';
}

export async function GET(req: NextRequest) {
  if (!process.env.ADMIN_TOKEN) return j(500, { ok:false, error:'env_missing_ADMIN_TOKEN' });
  const token = readToken(req);
  if (token !== process.env.ADMIN_TOKEN) return j(401, { ok:false, error:'unauthorized' });

  if (!process.env.DATABASE_URL) return j(500, { ok:false, error:'env_missing_DATABASE_URL' });

  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized:false }, max: 2 });
  const client = await pool.connect();
  try {
    const ping = await client.query('select 1 as one');
    const hasCitations = await client.query("select to_regclass('public.citations') as tbl");
    const hasSubs = await client.query("select to_regclass('public.subscriptions') as tbl");
    return j(200, {
      ok: true,
      db: 'online',
      ping: ping.rows[0].one,
      citations: hasCitations.rows[0].tbl,
      subscriptions: hasSubs.rows[0].tbl
    });
  } catch (e:any) {
    return j(500, { ok:false, error:'db_error', detail: String(e?.message||e) });
  } finally {
    client.release();
    await pool.end().catch(()=>{});
  }
}
