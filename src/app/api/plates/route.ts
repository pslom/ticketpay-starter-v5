import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { action } = body || {};

  if (action === 'list') {
    const { userId } = body;
    if (!userId) return NextResponse.json([], { status: 200 });
    const { data } = await supabase
      .from('plates')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('created_date', { ascending: false });
    return NextResponse.json(data ?? []);
  }

  if (action === 'create') {
    const { userId, license_plate, state, nickname } = body;
    if (!userId || !license_plate || !state) return NextResponse.json({ ok: false }, { status: 400 });

    // Per-user uniqueness
    const { data: exists } = await supabase
      .from('plates')
      .select('id')
      .eq('user_id', userId)
      .eq('license_plate', license_plate)
      .eq('state', state)
      .eq('active', true)
      .maybeSingle();
    if (exists) return NextResponse.json({ ok: false, reason: 'duplicate' }, { status: 409 });

    const { error } = await supabase.from('plates').insert({
      user_id: userId,
      license_plate,
      state,
      nickname: nickname || null,
      active: true,
      is_paused: false,
    });
    if (error) return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === 'deactivate') {
    const { id } = body;
    if (!id) return NextResponse.json({ ok: false }, { status: 400 });
    const { error } = await supabase.from('plates').update({ active: false }).eq('id', id);
    if (error) return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === 'toggle_pause') {
    const { id, pause, paused_until } = body;
    const update: any = { is_paused: !!pause };
    if (pause && paused_until) update.paused_until = paused_until;
    if (!pause) update.paused_until = null;

    const { error } = await supabase.from('plates').update(update).eq('id', id);
    if (error) return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 400 });
}
