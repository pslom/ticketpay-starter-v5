import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function GET() {
  return NextResponse.json({ ok: true, route: 'analytics/track' });
}

export async function POST(req: Request) {
  try {
    const s = getSupabaseServer();
    const bodyText = await req.text();
    const b = bodyText ? JSON.parse(bodyText) : {};
    const event_name = String(b.name || b.event_name || '').trim();
    const props = b.props || {};
    if (!event_name) return NextResponse.json({ ok:false, error:'missing_name' }, { status:400 });

    const { error } = await s.from('events').insert({ event: event_name, name: event_name, props });
    if (error) return NextResponse.json({ ok:false, error: error.message }, { status:500 });

    return NextResponse.json({ ok:true });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error: String(e?.message || e) }, { status:500 });
  }
}
