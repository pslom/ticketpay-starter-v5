export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function j(s:number,b:any){return new NextResponse(JSON.stringify(b),{status:s,headers:{'content-type':'application/json'}});}
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

  return (Array.isArray(items) ? items : []).map((raw:any) => ({
    city: 'SF',
    plate: String(raw.license_plate || raw.plate || '').trim(),
    state: String((raw.state || raw.plate_state || '')).trim().toUpperCase().slice(0,2),
    citation_number: String(raw.citation_number || raw.citation || raw.id || '').trim(),
    status: String(raw.status || 'open'),
    amount_cents: Math.round(Number(raw.fine_amount || raw.amount || 0) * 100),
    issued_at: raw.issued_datetime || raw.issue_datetime || raw.issue_date || raw.issued_at,
    location: raw.location || raw.blocklot || raw.blockface || raw.address || '',
    violation: raw.violation_description || raw.violation || '',
    source: 'datasf'
  })).filter(x => x.plate && plates.includes(x.plate.toUpperCase()));
}

export async function GET(req: NextRequest) {
  const token = readAdmin(req);
  if (!token || token !== (process.env.ADMIN_TOKEN||'')) return j(401,{ok:false,error:'unauthorized'});

  try {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, ssl: { rejectUnauthorized: false }});
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
    } finally { client.release(); await pool.end().catch(()=>{}); }
  } catch (e:any) {
    return j(500, { ok:false, error:'server_error', detail:String(e?.message||e) });
  }
}
