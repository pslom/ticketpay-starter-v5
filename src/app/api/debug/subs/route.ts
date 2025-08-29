import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
export async function GET() {
  const s = getSupabaseServer();
  const { data, error } = await s.from('subscriptions')
    .select('id,plate,state,channel,verified,verified_at,created_at')
    .order('created_at',{ascending:false})
    .limit(5);
  return NextResponse.json({ data, error });
}
