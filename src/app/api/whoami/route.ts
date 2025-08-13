export const runtime = 'nodejs';
export async function GET() {
  return Response.json({ ok: true, pid: process.pid, env: process.env.NODE_ENV, base: process.env.BASE_URL ?? null });
}
