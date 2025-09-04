import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SFMTARecord } from '@/types/sfmta';

const DUE_DAYS = Number(process.env.TICKET_DUE_DAYS ?? 21);

export async function POST(req: Request) {
  const { rows, lastImportISO } = (await req.json().catch(() => ({}))) as {
    rows: SFMTARecord[];
    lastImportISO?: string;
  };

  if (!Array.isArray(rows)) {
    return NextResponse.json({ ok: false, reason: 'rows required' }, { status: 400 });
  }

  const upserts = rows.map((r) => {
    // compute due_date = issue + DUE_DAYS
    const issue = new Date(r.citation_issued_datetime);
    const due = new Date(issue);
    due.setDate(due.getDate() + DUE_DAYS);

    return {
      citation_number: r.citation_number,
      citation_issued_datetime: issue.toISOString(),
      violation: r.violation ?? null,
      violation_desc: r.violation_desc ?? null,
      citation_location: r.citation_location ?? null,
      vehicle_plate_state: r.vehicle_plate_state,
      vehicle_plate: r.vehicle_plate,
      fine_amount: r.fine_amount ?? null,
      date_added: r.date_added ?? null,
      the_geom: r.the_geom ?? null,
      supervisor_districts: r.supervisor_districts ?? null,
      analysis_neighborhood: r.analysis_neighborhood ?? null,
      latitude: r.latitude ?? null,
      longitude: r.longitude ?? null,
      status: 'active',
      due_date: isFinite(due.getTime()) ? due.toISOString().slice(0, 10) : null,
      user_added: false,
    };
  });

  const { error } = await supabase.from('tickets').upsert(upserts, { onConflict: 'citation_number' });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // Touch last import banner (optional)
  if (lastImportISO) {
    await supabase
      .from('jurisdiction')
      .upsert({ name: 'San Francisco', state: 'CA', last_import: lastImportISO, active: true }, { onConflict: 'name,state' });
  }

  return NextResponse.json({ ok: true, upserted: upserts.length });
}
