export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { sendEmailPreview, sendSmsPreview } from "@/lib/notify";

type Channel = "email" | "sms";
type Body = { channel: Channel; value: string };

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^\+?[1-9]\d{7,14}$/.test(v); // simple E.164-ish

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Body>;
    const channel = body.channel;
    const value = (body.value || "").trim();

    if (channel === "email") {
      if (!isEmail(value)) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
      await sendEmailPreview(value);
    } else if (channel === "sms") {
      if (!isPhone(value)) return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
      await sendSmsPreview(value);
    } else {
      return NextResponse.json({ ok: false, error: "invalid_channel" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}