import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function isoDatePlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const windows: { type: 'due_soon_5d' | 'late_fee_48h'; date: string }[] = [
    { type: 'due_soon_5d', date: isoDatePlus(5) },
    { type: 'late_fee_48h', date: isoDatePlus(2) },
  ];

  let processed = 0;

  for (const w of windows) {
    // find tickets due on that date and still active
    const { data: tickets } = await supabase
      .from('tickets')
      .select('id, user_id, vehicle_plate, due_date, status')
      .eq('status', 'active')
      .eq('due_date', w.date)
      .limit(1000);

    for (const t of tickets ?? []) {
      // avoid double-send
      const { data: prior } = await supabase
        .from('alerts')
        .select('id')
        .eq('ticket_id', t.id)
        .eq('type', w.type)
        .limit(1);
      if (prior && prior.length > 0) continue;

      // TODO: look up user phone & send SMS via Twilio here

      await supabase.from('alerts').insert({
        user_id: t.user_id,
        plate_id: null,
        ticket_id: t.id,
        type: w.type,
        channel: 'sms',
        status: 'sent',
        message: `Reminder: ticket for ${t.vehicle_plate} is due ${t.due_date}`,
      });

      processed++;
    }
  }

  return NextResponse.json({ ok: true, processed });
}
