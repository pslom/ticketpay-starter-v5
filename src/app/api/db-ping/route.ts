export const runtime='nodejs';
import { getPool } from '@/lib/pg';
export async function GET(){
  try{
    const r = await getPool().query('select now() as now');
    return Response.json({ ok:true, now:r.rows[0]?.now||null });
  }catch(e: unknown){
     const msg = e instanceof Error ? e.message : String(e);
     console.error('DB_PING_ERROR', msg);
     return Response.json({ ok:false, error:msg }, { status:500 });
   }
 }
