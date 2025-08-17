export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

type Body = { email?: string; plate?: string; state?: string };
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const json = (await req.json().catch(() => ({}))) as Body;
  const email = (json.email || "").toString().trim();
  const plate = (json.plate || "").toString().trim().toUpperCase();
  const state = (json.state || "").toString().trim().toUpperCase();

  if (!emailRe.test(email)) return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  if (!plate || !state) return NextResponse.json({ ok: false, error: "Missing plate/state." }, { status: 400 });

  // TODO: persist to DB + send confirmation email. For now, pretend success.
  return NextResponse.json({ ok: true });
}
