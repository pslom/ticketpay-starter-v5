import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { userId, limit = 30 } = await req.json().catch(() => ({}));
  if (!userId) return NextResponse.json([]);

  const { data } = await supabase
    .from('alerts')
    .select('id, plate_id, ticket_id, type, channel, status, sent_at, message')
    .eq('user_id', userId)
    .order('sent_at', { ascending: false })
    .limit(limit);

  return NextResponse.json(data ?? []);
}
