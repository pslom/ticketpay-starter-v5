export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

type Body = {
  email?: string;
  channel?: 'sms' | 'email';
  value?: string; // phone for sms, email for email
  plate?: string;
  state?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const json = (await req.json().catch(() => ({}))) as Body;
  const channel = (json.channel || (json.email ? 'email' : undefined)) as 'sms' | 'email' | undefined;
  const value = (json.value || json.email || '').toString().trim();

  // Minimal validation (dev-friendly)
  if (!value) return NextResponse.json({ ok: false, error: 'Enter your email or mobile number.' }, { status: 400 });
  if ((channel === 'email' || value.includes('@')) && !emailRe.test(value)) {
    return NextResponse.json({ ok: false, error: 'Enter a valid email.' }, { status: 400 });
  }

  // TODO: persist subscription and send confirmation
  console.info('subscribe', {
    channel: channel || (value.includes('@') ? 'email' : 'sms'),
    value,
    plate: json.plate?.toUpperCase(),
    state: json.state?.toUpperCase(),
  });

  return NextResponse.json({ ok: true });
}
