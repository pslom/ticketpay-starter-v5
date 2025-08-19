export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createNotifier } from "@/lib/notifier";

type Channel = "email" | "sms";
type Body = { channel: Channel; value: string };

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^\+?[1-9]\d{7,14}$/.test(v); // simple E.164-ish

export async function POST(req: NextRequest) {
  try {
    const notifier = createNotifier();
    const body = (await req.json()) as Partial<Body>;
    const channel = body.channel;
    const value = (body.value || "").trim();

    if (channel === "email") {
      if (!isEmail(value)) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
      const subject = "TicketPay — example alert";
      const text = "TicketPay: New ticket — $65 · No Parking · Mission & 16th. Pay: https://example.invalid";
      const html = `<p>${text}</p>`;
      await notifier.notify({ channel: "email", to: value, subject, text, html });
    } else if (channel === "sms") {
      if (!isPhone(value)) return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
      const text = "TicketPay: New ticket — $65 · No Parking · Mission & 16th. Pay: https://example.invalid";
      await notifier.notify({ channel: "sms", to: value, text });
    } else {
      return NextResponse.json({ ok: false, error: "invalid_channel" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}