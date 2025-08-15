export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/pg';

function j(s:number,b: unknown){return new NextResponse(JSON.stringify(b),{status:s,headers:{'content-type':'application/json'}});}

function readAuth(req: NextRequest) {
  const hAuth = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const bearer = hAuth.toLowerCase().startsWith('bearer ') ? hAuth.slice(7).trim() : '';
  const xAdmin = req.headers.get('x-admin-token') || '';
  return { bearer, xAdmin };
}

async function dbcheck(admin: string) {
  const base = process.env.BASE_URL || 'https://www.ticketpay.us.com';
  const url  = `${base}/api/admin/dbcheck?token=${encodeURIComponent(admin)}&t=${Date.now()}`;
  const r = await fetch(url, { cache: 'no-store' });
  const data = await r.json().catch(() => ({ ok:false, error:'non_json_response' }));
  return { status: r.status, data };
}

async function fetchDataSF(sinceISO: string, appToken?: string) {
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
  const items = await r.json().catch(() => []);
  return Array.isArray(items) ? items : [];
}

function mapToSync(raw: unknown[]) {
  return raw.map((r: unknown) => {
    const obj = (r && typeof r === 'object') ? (r as Record<string, unknown>) : {};
    return {
      city: 'SF',
      plate: String(obj['license_plate'] || obj['plate'] || '').trim(),
      state: String((obj['state'] || obj['plate_state'] || '')).trim().toUpperCase().slice(0,2),
      citation_number: String(obj['citation_number'] || obj['citation'] || obj['id'] || '').trim(),
      status: String(obj['status'] || 'open'),
      amount_cents: Math.round(Number(obj['fine_amount'] || obj['amount'] || 0) * 100),
      issued_at: (obj['issued_datetime'] || obj['issue_datetime'] || obj['issue_date'] || obj['issued_at']),
      location: obj['location'] || obj['blocklot'] || obj['blockface'] || obj['address'] || '',
      violation: obj['violation_description'] || obj['violation'] || '',
      source: 'datasf'
    };
  });
}

export async function GET(req: NextRequest) {
  const { bearer, xAdmin } = readAuth(req);
  const CRON = process.env.CRON_SECRET || '';
  const ADMIN = process.env.ADMIN_TOKEN || '';
  const authed = (bearer && CRON && bearer === CRON) || (xAdmin && ADMIN && xAdmin === ADMIN) || (bearer && ADMIN && bearer === ADMIN);
  if (!authed) return j(401, { ok:false, error:'unauthorized' });

  const base = process.env.BASE_URL || 'https://www.ticketpay.us.com';

  try {
    // 1) DB Health
    const db = await dbcheck(ADMIN || '');

    // 2) Distinct subscribed plates in SF
    const pool = getPool();
    const client = await pool.connect();
    let plates: string[] = [];
    try {
      const q = `select distinct plate_normalized from public.subscriptions where city='SF'`;
      const r = await client.query<{ plate_normalized: string }>(q);
      plates = r.rows.map(x => x.plate_normalized);
    } finally { client.release(); }

    if (!plates.length) return j(200, { ok:true, db, note:'no_subscriptions', imported: 0 });

    // 3) Fetch DataSF window, map & filter
    const sinceISO = new Date(Date.now() - 48*3600*1000).toISOString();
    const ds = await fetchDataSF(sinceISO, process.env.DATASF_APP_TOKEN);
    const mapped = mapToSync(ds);
    const filtered = mapped.filter(x => x.plate && plates.includes(String(x.plate).toUpperCase()));
    if (!filtered.length) return j(200, { ok:true, db, fetched: ds.length, matched: 0, imported: 0 });

    // 4) Upsert via admin/sync
    const syncRes = await fetch(`${base}/api/admin/sync?t=${Date.now()}`, {
      method: 'POST',
      headers: { 'content-type':'application/json', 'x-admin-token': ADMIN },
      body: JSON.stringify({ items: filtered })
    });
    const syncBody = await syncRes.json().catch(() => ({ ok:false, error:'non_json_upstream' }));

    return j(200, { ok:true, db, fetched: ds.length, matched: filtered.length, sync: { status: syncRes.status, body: syncBody } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return j(500, { ok:false, error:'server_error', detail:String(msg) });
  }
}
