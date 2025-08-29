import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';
export async function GET() {
  const s = getSupabaseServer();
  const { data, error } = await s.from('events')
    .select('event,name,props,created_at')
    .order('created_at',{ascending:false})
    .limit(10);
  return NextResponse.json({ data, error });
}
