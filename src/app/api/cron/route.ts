export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function authOK(req: NextRequest, secret: string) {
  if (!secret) return false;
  const h1 = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const bearer = h1.toLowerCase().startsWith('bearer ') ? h1.slice(7).trim() : '';
  const h2 = (req.headers.get('x-cron-secret') || '').trim();
  const q = (req.nextUrl.searchParams.get('secret') || '').trim();
  return bearer === secret || h2 === secret || q === secret;
}

export async function GET(req: NextRequest) {
  const secret = (process.env.CRON_SECRET || '').trim();
  if (!secret) {
    return NextResponse.json({ ok:false, error:'env_missing_CRON_SECRET' }, { status: 500 });
  }
  if (!authOK(req, secret)) {
    return NextResponse.json({ ok:false, error:'unauthorized' }, { status: 401 });
  }

  // Optional: ping dbcheck to verify DB connectivity
  const base = process.env.BASE_URL || 'https://www.ticketpay.us.com';
  const admin = process.env.ADMIN_TOKEN || '';
  if (!admin) return NextResponse.json({ ok:true, note:'no ADMIN_TOKEN; skipped dbcheck' });

  try {
    const url = `${base}/api/admin/dbcheck?token=${encodeURIComponent(admin)}&t=${Date.now()}`;
    const r = await fetch(url, { cache: 'no-store' });
    const data = await r.json().catch(() => ({ ok:false, error:'non_json_response' }));
    return NextResponse.json({ ok:true, upstream_status: r.status, data });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:'cron_fetch_failed', detail: String(e?.message||e) }, { status: 500 });
  }
}
