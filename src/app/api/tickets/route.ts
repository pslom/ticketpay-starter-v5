import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { action, userId } = body || {};
  if (action !== 'list' || !userId) return NextResponse.json([]);

  // get user's active plates
  const { data: plates } = await supabase
    .from('plates')
    .select('license_plate, state')
    .eq('user_id', userId)
    .eq('active', true);

  if (!plates || plates.length === 0) return NextResponse.json([]);

  // fetch tickets for those plates
  const plateNums = plates.map((p) => p.license_plate);
  const states = [...new Set(plates.map((p) => p.state))];

  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('*')
    .in('vehicle_plate', plateNums)
    .in('vehicle_plate_state', states)
    .order('citation_issued_datetime', { ascending: false })
    .limit(200);

  if (error) return NextResponse.json([]);

  return NextResponse.json(tickets ?? []);
}
