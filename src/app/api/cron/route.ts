export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function bearer(req: NextRequest) {
  const h = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  return h.toLowerCase().startsWith('bearer ') ? h.slice(7).trim() : '';
}
function authOK(req: NextRequest, cronSecret: string, admin: string) {
  const b = bearer(req);
  const h2 = (req.headers.get('x-cron-secret') || '').trim();
  const q  = (req.nextUrl.searchParams.get('secret') || '').trim();
  const adminHdr = (req.headers.get('x-admin-token') || '').trim();
  return (
    (!!cronSecret && (b === cronSecret || h2 === cronSecret || q === cronSecret)) ||
    (!!admin && adminHdr === admin) // fallback for manual testing
  );
}

export async function GET(req: NextRequest) {
  const cronSecret = (process.env.CRON_SECRET || '').trim();
  const admin      = (process.env.ADMIN_TOKEN || '').trim();

  if (!cronSecret && !admin) {
    return NextResponse.json({ ok:false, error:'env_missing_secrets' }, { status: 500 });
  }
  if (!authOK(req, cronSecret, admin)) {
    return NextResponse.json({ ok:false, error:'unauthorized' }, { status: 401 });
  }

  // Ping dbcheck as our cron task
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
