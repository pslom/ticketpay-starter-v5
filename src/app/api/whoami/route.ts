import { NextRequest } from "next/server";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || undefined;
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin") || undefined;
  return new Response(
    JSON.stringify({
      ok: true,
      pid: process.pid,
      cwd: process.cwd(),
      env: process.env.NODE_ENV || "development",
    }),
    { headers: { "content-type": "application/json", ...corsHeaders(origin) } }
  );
}
