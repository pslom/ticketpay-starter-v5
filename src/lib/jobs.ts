import { getSupabaseServer } from '@/lib/supabase';
import { queryCitationsByPlate } from './sfdata';

const supabase = getSupabaseServer();

export async function runDailyPoll() {
  let processed = 0;
  let sent = 0;

  const { data: subs, error } = await supabase.from('subscriptions').select('*');
  if (error) throw error;
  if (!subs) return { processed: 0, sent: 0 };

  for (const sub of subs) {
    processed++;
    const since = '1970-01-01T00:00:00.000Z';
    const citations = await queryCitationsByPlate({ plate: sub.plate, state: sub.state, since });

    if (!citations.length) {
      await supabase.from('subscriptions').update({ last_checked_at: new Date().toISOString() }).eq('id', sub.id);
      continue;
    }

    for (const c of citations) {
      const { data: existing } = await supabase
        .from('sub_citations')
        .select('id')
        .eq('subscription_id', sub.id)
        .eq('citation_id', c.citation_number)
        .maybeSingle();
      if (existing) continue;

      const ins1 = await supabase.from('sub_citations').insert({
        subscription_id: sub.id,
        citation_id: c.citation_number,
        issued_at: c.citation_issued_datetime,
        fine_amount: c.fine_amount,
        violation_desc: c.violation_desc,
        raw: c
      });
      if (ins1.error) throw ins1.error;

      const ins2 = await supabase.from('messages').insert({
        subscription_id: sub.id,
        kind: 'new',
        citation_id: c.citation_number
      });
      if (ins2.error) throw ins2.error;

      sent++;
    }

    await supabase.from('subscriptions')
      .update({ last_checked_at: new Date().toISOString(), last_seen_citation_id: citations[0].citation_number })
      .eq('id', sub.id);
  }

  return { processed, sent };
}
