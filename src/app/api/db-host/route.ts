export async function GET(){return new Response(String(process.env.DATABASE_URL||''));}
