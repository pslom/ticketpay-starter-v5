export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/pg';

function j(s:number,b:any){
  return new NextResponse(JSON.stringify(b), {
    status:s,
    headers:{
      'content-type':'application/json',
      'x-unsub-ver':'v2',
      'access-control-allow-origin':'https://www.ticketpay.us.com, https://ticketpay.us.com, http://localhost:3000, http://localhost:3010',
      'access-control-allow-headers':'content-type, authorization',
      'access-control-allow-methods':'OPTIONS, GET, POST',
    }
  });
}
export async function OPTIONS(){ return j(204,{}); }

const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function handle(id: string) {
  try {
    const safe=(id||'').trim();
    if (!safe || !UUID_RE.test(safe)) {
      // Treat missing/invalid IDs as already unsubscribed
      return j(200,{ ok:true, removed:0, note:'invalid_or_empty_id' });
    }
    const pool=getPool();
    const client=await pool.connect();
    try{
      const r=await client.query('DELETE FROM public.subscriptions WHERE id=$1::uuid RETURNING id',[safe]);
      return j(200,{ ok:true, removed:r.rowCount||0 });
    } finally { client.release(); }
  } catch(e:any){
    return j(500,{ ok:false, error:'server_error', detail:String(e?.message||e) });
  }
}

export async function POST(req: NextRequest){
  let id=''; try{ const b=await req.json(); id=String(b?.id||''); }catch{}
  return handle(id);
}
export async function GET(req: NextRequest){
  return handle(String(req.nextUrl.searchParams.get('id')||''));
}
