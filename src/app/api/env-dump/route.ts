export async function GET(){
  const v = process.env.DATABASE_URL || '';
  const safe = v.replace(/:[^:@/]+@/,'://****@');
  return new Response(safe, { headers: { 'content-type': 'text/plain' } });
}
