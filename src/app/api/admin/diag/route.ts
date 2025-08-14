import { getPool } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('DIAG DATABASE_URL:', process.env.DATABASE_URL);
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }
    const pool = getPool();
    const result = await pool.query('SELECT NOW() as now');
    await pool.end();
    return Response.json({
      ok: true,
      now: result.rows[0]?.now ?? null,
      db_host: new URL(process.env.DATABASE_URL).host,
      pooled: process.env.DATABASE_URL.includes('pooler.supabase.com'),
    });
  } catch (e) {
    console.error('ADMIN_DIAG_ERROR', {
      message: e?.message,
      code: e?.code,
      detail: e?.detail,
      stack: e?.stack,
    });
    return Response.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}