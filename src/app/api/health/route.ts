export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  // Lightweight liveness probe; add DB checks if needed in admin/dbcheck
  return NextResponse.json({ ok: true, status: 'healthy', ts: Date.now() });
}
