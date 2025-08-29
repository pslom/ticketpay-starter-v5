import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

const PAY_AT_SFMTA_URL = 'https://wmq.etimspayments.com/pbw/include/sanfrancisco/input.jsp';

type Sub = {
  id: string
  plate: string
  state: string
  channel: 'sms'|'email'
  contact: string
  paused_at: string | null
}
type SubCitation = {
  id: string
  subscription_id: string
  citation_id: string
  issued_at: string | null
  // optional fields in your table:
  due_date?: string | null
}

function approxDaysLeft(due: Date): number {
  return (due.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
}
function within(v: number, target: number, window: number) {
  return Math.abs(v - target) <= window;
}

async function hasSent(supabase: any, subId: string, citationId: string, kind: string) {
  const { data } = await supabase
    .from('messages')
    .select('id')
    .eq('subscription_id', subId)
    .eq('citation_id', citationId)
    .eq('kind', kind)
    .maybeSingle();
  return !!data;
}

async function recordSend(supabase: any, subId: string, citationId: string, kind: string) {
  await supabase.from('messages').insert({ subscription_id: subId, citation_id: citationId, kind });
}

async function sendReminder(kind: 'reminder_5d'|'reminder_48h', sub: Sub, citationId: string, dueDate: Date) {
  const plateLine = `${sub.state.toUpperCase()} ${sub.plate.toUpperCase()}`;
  const when = kind === 'reminder_5d' ? '5 days' : '48 hours';
  const text = `TicketPay: Reminder — ticket for ${plateLine} is due in ${when}. Pay at SFMTA: ${PAY_AT_SFMTA_URL}`;
  const html = `TicketPay reminder — ticket for <b>${plateLine}</b> is due in <b>${when}</b>.<br/><a href="${PAY_AT_SFMTA_URL}">Pay at SFMTA</a>`;

  // Hook in your real senders here if you want:
  // if (sub.channel === 'sms') await sendSms(sub.contact, text)
  // else await sendEmail(sub.contact, 'SFMTA ticket reminder', html)

  console.log('Would send', { channel: sub.channel, to: sub.contact, kind, citationId, due: dueDate.toISOString() });
}

export async function POST() {
  try {
    const supabase = getSupabaseServer();

    // Load active subscriptions (not paused)
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('id,plate,state,channel,contact,paused_at')
      .order('created_at', { ascending: false });

    const activeMap = new Map<string, Sub>();
    (subs || []).forEach((s: Sub) => {
      if (!s.paused_at) activeMap.set(s.id, s);
    });
    if (activeMap.size === 0) return NextResponse.json({ ok: true, scanned: 0, sent: 0 });

    // Load citations tied to those subscriptions
    const { data: citations } = await supabase
      .from('sub_citations')
      .select('id,subscription_id,citation_id,issued_at,due_date');

    let scanned = 0, sent = 0;

    for (const c of (citations || []) as SubCitation[]) {
      scanned++;
      const sub = activeMap.get(c.subscription_id);
      if (!sub) continue;

      // Compute due date: prefer stored due_date; else issued_at + 21 days
      const due = c.due_date
        ? new Date(c.due_date)
        : new Date(new Date(c.issued_at || Date.now()).getTime() + 21 * 24 * 60 * 60 * 1000);

      const daysLeft = approxDaysLeft(due);

      // 5-day window: ±0.5 day
      if (within(daysLeft, 5, 0.5)) {
        const kind = 'reminder_5d';
        if (!(await hasSent(supabase, sub.id, c.citation_id, kind))) {
          await sendReminder(kind as any, sub, c.citation_id, due);
          await recordSend(supabase, sub.id, c.citation_id, kind);
          sent++;
        }
      }

      // 48-hour window: 2 days ± 0.08 (~2 hours)
      if (within(daysLeft, 2, 0.08)) {
        const kind = 'reminder_48h';
        if (!(await hasSent(supabase, sub.id, c.citation_id, kind))) {
          await sendReminder(kind as any, sub, c.citation_id, due);
          await recordSend(supabase, sub.id, c.citation_id, kind);
          sent++;
        }
      }
    }

    return NextResponse.json({ ok: true, scanned, sent });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function GET() {
  // small health check
  return NextResponse.json({ ok: true, route: 'jobs/reminders' });
}
