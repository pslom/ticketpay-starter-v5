export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export async function GET(req: NextRequest) {
  const admin = (process.env.ADMIN_TOKEN || '').trim();
  const got   = (req.headers.get('x-admin-token') || '').trim();
  if (!admin || got !== admin) {
    return NextResponse.json({ ok:false, error:'unauthorized' }, { status: 401 });
  }
  const s = (process.env.CRON_SECRET || '');
  const sha = s ? createHash('sha256').update(s).digest('hex') : null;
  return NextResponse.json({
    ok: true,
    present: !!s,
    len: s ? s.length : 0,
    sha256_prefix: sha ? sha.slice(0, 16) : null
  });
}
