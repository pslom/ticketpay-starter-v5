export async function GET(){
const v = process.env.DATABASE_URL || '';
const safe = v.replace(/:[^:@/]+@/,'://****@');
const out = {
DATABASE_URL: safe,
DATABASE_URL_SCHEME: v.split(':')[0] || null,
NODE_ENV: process.env.NODE_ENV || null
};
return new Response(JSON.stringify(out,null,2),{headers:{'content-type':'application/json'}});
}
