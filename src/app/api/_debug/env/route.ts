export const runtime = "nodejs";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  if (!process.env.DEBUG_EMAIL_TOKEN || token !== process.env.DEBUG_EMAIL_TOKEN) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), { status: 401 });
  }
  const redact = (v?: string | null) => (v ? `${v.slice(0, 3)}…(${v.length})` : null);
  return new Response(
    JSON.stringify({
      ok: true,
      env: {
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? "present" : "missing",
        EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
        EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
        EMAIL_REPLY_TO_ADDRESS: process.env.EMAIL_REPLY_TO_ADDRESS,
        EMAIL_TO_OVERRIDE: process.env.EMAIL_TO_OVERRIDE,
        key_preview: redact(process.env.SENDGRID_API_KEY || ""),
      },
    }),
    { headers: { "content-type": "application/json" } }
  );
}