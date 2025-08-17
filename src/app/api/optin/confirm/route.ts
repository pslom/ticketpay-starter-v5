import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/optin";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") || "";
    const d = verifyToken(token);

    // Hit the existing subscribe API to persist
    const r = await fetch(`${process.env.BASE_URL || "http://127.0.0.1:3000"}/api/subscribe`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plate: d.plate, state: d.state, city: d.city || "", channel: d.channel, value: d.value }),
      cache: "no-store",
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.ok) throw new Error(j?.error || `subscribe_failed_${r.status}`);

    return Response.json({ ok: true, plate: d.plate, state: d.state, channel: d.channel, value: d.value });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || "invalid_token" }, { status: 400 });
  }
}
