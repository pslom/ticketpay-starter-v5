export const runtime='nodejs';
import { getPool } from '@/lib/db';
export async function GET(){
  try{
    const r = await getPool().query('select now() as now');
    return Response.json({ ok:true, now:r.rows[0]?.now||null });
  }catch(e:any){
    console.error('DB_PING_ERROR', e?.message||e);
    return Response.json({ ok:false, error:e?.message||String(e) }, { status:500 });
  }
}
