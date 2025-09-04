import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { userId } = await req.json().catch(() => ({}));
  if (!userId) return NextResponse.json({ totals: { plates: 0, activeTickets: 0, dueSoon: 0 }, lastImportISO: null });

  const { data: plates } = await supabase
    .from('plates')
    .select('license_plate, state')
    .eq('user_id', userId)
    .eq('active', true);

  const totals = { plates: plates?.length ?? 0, activeTickets: 0, dueSoon: 0 };

  if (plates && plates.length > 0) {
    const plateNums = plates.map((p) => p.license_plate);
    const states = [...new Set(plates.map((p) => p.state))];

    const { data: tix } = await supabase
      .from('tickets')
      .select('status, due_date, vehicle_plate, vehicle_plate_state')
      .in('vehicle_plate', plateNums)
      .in('vehicle_plate_state', states)
      .limit(1000);

    const today = new Date();
    for (const t of tix ?? []) {
      if (t.status === 'active') {
        totals.activeTickets++;
        if (t.due_date) {
          const dd = new Date(t.due_date);
          const diff = Math.ceil((dd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (diff >= 0 && diff <= 5) totals.dueSoon++;
        }
      }
    }
  }

  // last import
  const { data: j } = await supabase
    .from('jurisdiction')
    .select('last_import')
    .eq('name', 'San Francisco')
    .eq('state', 'CA')
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ totals, lastImportISO: j?.last_import ?? null });
}
