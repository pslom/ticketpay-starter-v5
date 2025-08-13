export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getPool } from '@/lib/db';
import { normalizePlate, normalizeState, CITY_DEFAULT } from '@/lib/normalizers';

const item = z.object({
  plate: z.string().min(2).max(12),
  state: z.string().min(2).max(3),
  citation_number: z.string().min(1),
  amount_cents: z.number().int().nonnegative(),
  issued_at: z.union([z.string(), z.date()]).transform(v => new Date(v).toISOString()),
  location: z.string().optional().nullable(),
  violation: z.string().optional().nullable(),
  city: z.string().optional(),
});
const payloadSchema = z.object({ items: z.array(item).min(1) });

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return Response.json({ ok:false, error:'unauthorized' }, { status: 401 });
  }

  let parsed;
  try { parsed = payloadSchema.parse(await req.json()); }
  catch { return Response.json({ ok:false, error:'invalid_input' }, { status: 400 }); }

  const pool = getPool();
  let inserted = 0;

  for (const it of parsed.items) {
    const plateNorm = normalizePlate(it.plate);
    const stateNorm = normalizeState(it.state);
    const cityUse = (it.city || CITY_DEFAULT).toUpperCase();

    const res = await pool.query(
      `insert into citations (city, plate, plate_normalized, state, citation_number, status, amount_cents, issued_at, location, violation, source)
       values ($1,$2,$3,$4,$5,'unpaid',$6,$7,$8,$9,'sync')
       on conflict (plate_normalized, state, citation_number, city) do nothing
       returning id`,
      [cityUse, it.plate, plateNorm, stateNorm, it.citation_number, it.amount_cents, it.issued_at, it.location || null, it.violation || null]
    );

    const count = (res.rowCount ?? 0); // pg types: number | null
    if (count > 0) inserted++;
  }

  return Response.json({ ok:true, inserted });
}

export async function OPTIONS() { return new Response(null, { status: 204 }); }
