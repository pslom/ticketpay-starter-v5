export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function bearer(req: NextRequest) {
  const h = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  return h.toLowerCase().startsWith('bearer ') ? h.slice(7).trim() : '';
}

export async function GET(req: NextRequest) {
  const secret = (process.env.CRON_SECRET || '').trim();
  if (!secret) return NextResponse.json({ ok:false, error:'env_missing_CRON_SECRET' }, { status: 500 });

  const token = bearer(req);
  if (token !== secret) return NextResponse.json({ ok:false, error:'unauthorized' }, { status: 401 });

  // Optional: ping dbcheck so you get status in logs
  const admin = (process.env.ADMIN_TOKEN || '').trim();
  if (!admin) return NextResponse.json({ ok:true, note:'no ADMIN_TOKEN; skipped dbcheck' });

  try {
    const base = process.env.BASE_URL || 'https://www.ticketpay.us.com';
    const url  = `${base}/api/admin/dbcheck?token=${encodeURIComponent(admin)}&t=${Date.now()}`;
    const r = await fetch(url, { cache: 'no-store' });
    const data = await r.json().catch(() => ({ ok:false, error:'non_json_response' }));
    return NextResponse.json({ ok:true, upstream_status: r.status, data });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:'cron_fetch_failed', detail: String(e?.message||e) }, { status: 500 });
  }
}
