export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const base = process.env.BASE_URL || 'https://www.ticketpay.us.com';
    const inbound = await req.json().catch(() => ({}));
    const body = { op: 'subscribe', ...inbound };
    const r = await fetch(`${base}/api/core`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const j = await r.json().catch(() => ({ ok:false, error:'non_json_upstream' }));
    return NextResponse.json(j, { status: r.status });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:'server_error', detail:String(e?.message||e) }, { status: 500 });
  }
}
