export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      pid: process.pid,
      cwd: process.cwd(),
      env: process.env.NODE_ENV || "development",
    }),
    { headers: { "content-type": "application/json" } }
  );
}
