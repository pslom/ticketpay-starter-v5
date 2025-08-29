export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getPool } from '@/app/lib/pg';

export async function GET() {
  const db = getPool();
  const { rows } = await db.query(`
    select
      s.id,
      upper(s.plate) as plate,
      upper(s.state) as state,
      s.channel,
      s.created_at,
      s.last_checked_at,
      s.last_seen_citation_id,
      coalesce(cnt_open.open_count, 0)::int as open_count,
      last_dates.last_ticket_at,
      next_due.next_late_at
    from subscriptions s
    left join (
      select subscription_id, count(*) as open_count
      from sub_citations
      where paid = false
      group by subscription_id
    ) cnt_open on cnt_open.subscription_id = s.id
    left join (
      select subscription_id, max(issued_at) as last_ticket_at
      from sub_citations
      group by subscription_id
    ) last_dates on last_dates.subscription_id = s.id
    left join (
      select subscription_id, min(late_at) as next_late_at
      from sub_citations
      where paid = false and late_at is not null
      group by subscription_id
    ) next_due on next_due.subscription_id = s.id
    order by s.created_at desc
    limit 200
  `);

  return NextResponse.json({ ok: true, subscriptions: rows });
}
