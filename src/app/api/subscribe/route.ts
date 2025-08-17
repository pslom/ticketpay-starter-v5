export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { sendSubscribeConfirmEmail } from '@/lib/email';

type Body = {
  plate?: string;
  state?: string;
  channel?: 'email' | 'sms';
  value?: string; // email or phone
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Body;
  const plate = (b.plate || '').toUpperCase().trim();
  const state = (b.state || '').toUpperCase().trim();
  const channel = b.channel || (b.value?.includes('@') ? 'email' : 'sms');
  const value = (b.value || '').trim();

  if (!value) return NextResponse.json({ ok: false, error: 'Enter your email or mobile number.' }, { status: 400 });
  if (channel === 'email' && !emailRe.test(value)) {
    return NextResponse.json({ ok: false, error: 'Enter a valid email.' }, { status: 400 });
  }

  // TODO: persist to DB (unique on plate/state/channel/value)
  console.info('subscribe', { plate, state, channel, value });

  // Send confirmation email only when available
  if (channel === 'email') {
    try {
      await sendSubscribeConfirmEmail(value, plate, state);
    } catch (e) {
      console.error('email.send.failed', e);
      // Still return ok; email isn’t critical to subscription
    }
  }

  return NextResponse.json({ ok: true });
}
