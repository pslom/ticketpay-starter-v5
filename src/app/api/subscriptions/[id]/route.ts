import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const s = getSupabaseServer();
  const body = await req.json().catch(()=>({}));
  const op = String(body.op || '').toLowerCase();
  if (!['pause','resume'].includes(op)) {
    return NextResponse.json({ ok:false, error:'bad_op' }, { status:400 });
  }
  const patch = op === 'pause' ? { paused_at: new Date().toISOString() } : { paused_at: null };
  const { error } = await s.from('subscriptions').update(patch).eq('id', params.id);
  if (error) return NextResponse.json({ ok:false, error:error.message }, { status:500 });
  return NextResponse.json({ ok:true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const s = getSupabaseServer();
  await s.from('messages').delete().eq('subscription_id', params.id);
  await s.from('sub_citations').delete().eq('subscription_id', params.id);
  const { error } = await s.from('subscriptions').delete().eq('id', params.id);
  if (error) return NextResponse.json({ ok:false, error:error.message }, { status:500 });
  return NextResponse.json({ ok:true });
}
