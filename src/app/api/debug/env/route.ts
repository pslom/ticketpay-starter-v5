export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const provided =
    url.searchParams.get("token") ||
    req.headers.get("x-debug-token") ||
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "") ||
    "";

  const server = (process.env.DEBUG_EMAIL_TOKEN || "").trim();

  const ok = server && provided && provided === server;

  const body = ok
    ? {
        ok: true,
        env: {
          SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? "present" : "missing",
          EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
          EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
          EMAIL_REPLY_TO_ADDRESS: process.env.EMAIL_REPLY_TO_ADDRESS,
          EMAIL_TO_OVERRIDE: process.env.EMAIL_TO_OVERRIDE,
          key_preview: (process.env.SENDGRID_API_KEY || "").slice(0, 3) + "…",
        },
      }
    : {
        ok: false,
        error: "unauthorized",
        details: {
          server_has_token: Boolean(server),
          server_token_len: server.length,
          provided_token_len: provided.length,
          note: "Set DEBUG_EMAIL_TOKEN in Vercel Production and pass ?token=… (or Authorization: Bearer …).",
        },
      };

  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    status: ok ? 200 : 401,
  });
}