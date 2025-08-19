export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/pg';

function j(s:number,b: unknown){return new NextResponse(JSON.stringify(b),{status:s,headers:{'content-type':'application/json'}});} 
function readAdmin(req: NextRequest){ return req.headers.get('x-admin-token') || req.headers.get('authorization')?.replace(/^Bearer\s+/i,'') || ''; }

async function fetchDataSF(sinceISO: string, plates: string[], appToken?: string) {
  const base = 'https://data.sfgov.org/resource/ab4h-6ztd.json';
  const params = new URLSearchParams({
    '$limit': '5000',
    '$order': 'issued_datetime DESC',
    '$where': `issued_datetime >= '${sinceISO}'`
  });
  const url = `${base}?${params.toString()}`;
  const headers: Record<string,string> = {};
  if (appToken) headers['X-App-Token'] = appToken;

  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`DataSF ${r.status}`);
  const items = await r.json();

  const arr = Array.isArray(items) ? items : [];
  return arr.map((raw: unknown) => {
    const r = (raw && typeof raw === 'object') ? (raw as Record<string, unknown>) : {};
    return {
      city: 'SF',
      plate: String(r['license_plate'] || r['plate'] || '').trim(),
      state: String((r['state'] || r['plate_state'] || '')).trim().toUpperCase().slice(0,2),
      citation_number: String(r['citation_number'] || r['citation'] || r['id'] || '').trim(),
      status: String(r['status'] || 'open'),
      amount_cents: Math.round(Number(r['fine_amount'] || r['amount'] || 0) * 100),
      issued_at: (r['issued_datetime'] || r['issue_datetime'] || r['issue_date'] || r['issued_at']),
      location: r['location'] || r['blocklot'] || r['blockface'] || r['address'] || '',
      violation: r['violation_description'] || r['violation'] || '',
      source: 'datasf'
    };
  }).filter(x => x.plate && plates.includes(x.plate.toUpperCase()));
}

export async function GET(req: NextRequest) {
  const token = readAdmin(req);
  if (!token || token !== (process.env.ADMIN_TOKEN||'')) return j(401,{ok:false,error:'unauthorized'});

  try {
    const pool = getPool();
    const client = await pool.connect();
    try {
      const { rows } = await client.query<{ plate_normalized: string }>(
        `select distinct plate_normalized from public.subscriptions where city='SF'`
      );
      const plates = rows.map(r => r.plate_normalized);
      if (plates.length === 0) return j(200, { ok:true, imported: 0, skipped: 'no_subscriptions' });

      const sinceISO = new Date(Date.now() - 48*3600*1000).toISOString();
      const dsf = await fetchDataSF(sinceISO, plates, process.env.DATASF_APP_TOKEN);

      if (dsf.length === 0) return j(200, { ok:true, imported: 0 });

      const res = await fetch(`${process.env.BASE_URL || 'https://www.ticketpay.us.com'}/api/admin/sync`, {
        method: 'POST',
        headers: {
          'content-type':'application/json',
          'authorization': `Bearer ${process.env.ADMIN_TOKEN||''}`
        },
        body: JSON.stringify({ items: dsf })
      });
      const body = await res.json().catch(()=>({ ok:false, error:'non_json_upstream' }));
      return j(res.status, { ok: res.ok, upstream_status: res.status, body });
    } finally { try { client.release(); } catch {} }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return j(500, { ok:false, error:'server_error', detail: msg });
  }
}
