export const runtime = 'nodejs';
import type { NextRequest } from 'next/server';
import { getPool } from '@/lib/db';

export async function OPTIONS() { return new Response(null, { status: 204 }); }

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return Response.json({ ok:false, error:'unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return Response.json({ ok:false, error:'no_items' }, { status: 400 });
    }

    const pool = getPool();
    const normPlate = (s:string) => s.toUpperCase().replace(/[^A-Za-z0-9]/g, '');
    const normState = (s:string) => s.toUpperCase();
    const CITY_DEFAULT = (process.env.CITY_DEFAULT || 'SF').toUpperCase();

    let inserted = 0;
    for (const it of items) {
      const plate = String(it.plate||'');
      const state = String(it.state||'');
      const citation = String(it.citation_number||'');
      const amount = Number(it.amount_cents||0);
      const issued = new Date(it.issued_at||Date.now()).toISOString();
      const location = it.location ?? null;
      const violation = it.violation ?? null;
      const city = String(it.city || CITY_DEFAULT).toUpperCase();

      const res = await pool.query(
        `insert into citations (city, plate, plate_normalized, state, citation_number, status, amount_cents, issued_at, location, violation, source)
         values ($1,$2,$3,$4,$5,'unpaid',$6,$7,$8,$9,'sync')
         on conflict (plate_normalized, state, citation_number, city) do nothing
         returning id`,
        [city, plate, normPlate(plate), normState(state), citation, amount, issued, location, violation]
      );
      if ((res.rowCount ?? 0) > 0) inserted++;
    }

    return Response.json({ ok:true, inserted });
  } catch (e:any) {
    console.error('ADMIN_SYNC_ERROR', e?.message || e);
    return Response.json({ ok:false, error:'server_error' }, { status: 500 });
  }
}
