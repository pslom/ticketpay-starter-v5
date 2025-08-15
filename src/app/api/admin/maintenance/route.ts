export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import type { NextRequest } from 'next/server'; import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/pg';

function j(s:number,b: unknown){return new NextResponse(JSON.stringify(b),{status:s,headers:{'content-type':'application/json'}});} 
function readAdmin(req: NextRequest){ return req.headers.get('x-admin-token') || req.headers.get('authorization')?.replace(/^Bearer\s+/i,'') || ''; }
export async function POST(req: NextRequest){
  const token = readAdmin(req);
  if (!token || token !== (process.env.ADMIN_TOKEN||'')) return j(401,{ok:false,error:'unauthorized'});
  try{
    const pool = getPool();
    const client = await pool.connect();
    try{
      const r = await client.query(`DELETE FROM public.rate_limits WHERE window_start < now() - interval '2 days'`);
      return j(200,{ ok:true, pruned: r.rowCount||0 });
    } finally { try { client.release(); } catch {} }
  }catch(e: unknown){ const msg = e instanceof Error ? e.message : String(e); return j(500,{ ok:false, error:'server_error', detail: msg }); }
}
