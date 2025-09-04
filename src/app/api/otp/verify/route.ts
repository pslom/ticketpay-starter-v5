import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { supabase } from '@/lib/supabase';

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: Request) {
  const { phone, code, userId } = await req.json().catch(() => ({}));
  if (!phone || !code || !userId) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({ to: phone, code });

    if (check.status !== 'approved') return NextResponse.json({ ok: false }, { status: 401 });

    // Mark phone verified on your user row
    await supabase.from('users').update({
      phone,
      phone_verified: true,
    }).eq('id', userId);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
