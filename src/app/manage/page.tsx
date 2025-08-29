import { getSupabaseServer } from '@/lib/supabase';
import ManageTable from '@/components/ManageTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ManagePage() {
  const s = getSupabaseServer();
  const { data } = await s.from('subscriptions')
    .select('id,plate,state,channel,contact,verified,paused_at,last_checked_at,created_at')
    .order('created_at',{ ascending:false })
    .limit(100);
  const rows = data || [];
  return (
    <div className="mx-auto max-w-[960px] px-5 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage alerts</h1>
        <Link href="/" className="btn-primary">Add another plate</Link>
      </div>
      <ManageTable rows={rows as any} />
      <p className="text-sm text-neutral-500">Powered by City of SF Data · Alerts apply to SFMTA tickets only.</p>
    </div>
  );
}
