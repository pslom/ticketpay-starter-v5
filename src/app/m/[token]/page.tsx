import { verifyMagic } from '@/lib/magic';
import { getSupabaseServer } from '@/lib/supabase';
import ConfettiOnce from '@/components/ConfettiOnce';
import Link from 'next/link';
import { PAY_AT_SFMTA_URL } from '@/lib/externals';

export const dynamic = 'force-dynamic';

export default async function MagicPage({ params }: { params: { token: string } }) {
  const payload = verifyMagic(params.token);
  if (!payload) {
    return (
      <div className="mx-auto max-w-[900px] px-5 py-12">
        <div className="card p-8 space-y-4">
          <h1 className="text-2xl font-bold">Link expired or invalid</h1>
          <p className="text-neutral-700">Please start again.</p>
          <Link href="/" className="btn-primary w-fit">Home</Link>
        </div>
      </div>
    );
  }

  const s = getSupabaseServer();

  if (payload.subId) {
    await s.from('subscriptions')
      .update({ verified: true, verified_at: new Date().toISOString() })
      .eq('id', payload.subId);
  } else {
    const { data: row } = await s.from('subscriptions')
      .select('id')
      .eq('plate', payload.plate)
      .eq('state', payload.state)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (row?.id) {
      await s.from('subscriptions')
        .update({ verified: true, verified_at: new Date().toISOString() })
        .eq('id', row.id);
    }
  }

  return (
    <div className="mx-auto max-w-[900px] px-5 py-12">
      <ConfettiOnce />
      <div className="card p-8 space-y-6">
        <h1 className="text-2xl font-bold">You’re all set</h1>
        <p className="text-neutral-700">We’ll notify you when a ticket appears for {payload.state} {payload.plate}, then send 5-day and 48-hour reminders if it’s still open.</p>
        <p className="text-sm text-neutral-600">Checks run daily; alerts usually within 24 hours.</p>
        <div className="flex items-center gap-3">
          <Link href="/manage" className="btn-secondary">Manage alerts</Link>
          <a href={PAY_AT_SFMTA_URL} target="_blank" rel="noreferrer" className="btn-primary">Pay at SFMTA</a>
        </div>
      </div>
    </div>
  );
}
