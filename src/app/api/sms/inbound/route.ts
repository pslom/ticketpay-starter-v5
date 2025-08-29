import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const s = getSupabaseServer();

  // Twilio posts application/x-www-form-urlencoded
  const form = await req.formData();
  const bodyRaw = String(form.get('Body') || '');
  const fromRaw = String(form.get('From') || '');

  const body = bodyRaw.trim().toUpperCase();
  const digits = fromRaw.replace(/\D/g, '');
  if (!digits) return new NextResponse('OK', { status: 200 });

  const e164 = digits.startsWith('1') ? `+${digits}` : `+1${digits}`;

  if (body.includes('STOP')) {
    await s.from('subscriptions')
      .update({ paused_at: new Date().toISOString() })
      .eq('channel','sms').eq('contact', e164);
    return new NextResponse('You are opted out. Reply START to resume.', { status: 200 });
  }

  if (body.includes('START')) {
    await s.from('subscriptions')
      .update({ paused_at: null })
      .eq('channel','sms').eq('contact', e164);
    return new NextResponse('Alerts resumed. You will receive ticket notifications.', { status: 200 });
  }

  if (body.includes('HELP')) {
    return new NextResponse('TicketPay: SF ticket alerts. Pay at SFMTA. Support: support@ticketpay.us.com', { status: 200 });
  }

  return new NextResponse('OK', { status: 200 });
}
