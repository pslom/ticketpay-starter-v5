export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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
  try {
    if (!process.env.ADMIN_TOKEN) return j(500, { ok:false, error:'env_missing_ADMIN_TOKEN' });
    const token = readToken(req);
    if (token !== process.env.ADMIN_TOKEN) return j(401, { ok:false, error:'unauthorized' });

    return j(200, {
      ok: true,
      runtime: 'nodejs',
      time: new Date().toISOString()
    });
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
