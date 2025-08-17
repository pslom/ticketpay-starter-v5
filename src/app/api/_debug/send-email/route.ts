import { NextResponse } from "next/server";
import { sendSubscribeConfirmEmail } from "@/lib/email";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  if (!process.env.DEBUG_EMAIL_TOKEN || token !== process.env.DEBUG_EMAIL_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const to = url.searchParams.get("to") || "info@ticketpay.us.com";
  try {
    const res = await sendSubscribeConfirmEmail(to, "ABC123", "CA");
    return NextResponse.json({ ok: true, res });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.response?.body || e?.message || String(e) }, { status: 500 });
  }
}