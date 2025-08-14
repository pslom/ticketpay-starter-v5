export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { getPool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return Response.json({ ok:false, error:'unauthorized' }, { status: 401 });
  }
  try {
    const pool = getPool();
    const r = await pool.query('select now() as now');
    return Response.json({
      ok: true,
      now: r.rows[0]?.now ?? null,
      db_host: (process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).host : null),
      pooled: !!process.env.DATABASE_URL && process.env.DATABASE_URL.includes('pooler.supabase.com')
    });
  } catch (e) {
    const err: any = e;
    console.error('ADMIN_DIAG_ERROR', { message: err?.message, code: err?.code, detail: err?.detail });
    return Response.json({ ok:false, error:'server_error' }, { status: 500 });
  }
}
