export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { createNotifier } from "@/lib/notifier";

const Body = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export async function GET() {
  const html = `<!doctype html><meta charset="utf-8"><title>send-test</title>
  <style>body{font-family:system-ui;padding:24px;max-width:720px;margin:auto}form>*{display:block;margin-top:8px}</style>
  <h1>/api/send-test</h1>
  <p>POST JSON: {"email":"you@example.com"} or {"phone":"+15551234567"} — or use the form below.</p>
  <form method="post">
    <label>Email <input name="email" type="email" /></label>
    <label>Phone <input name="phone" type="tel" /></label>
    <button type="submit">Send test</button>
  </form>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    let email: string | undefined;
    let phone: string | undefined;

    if (ct.includes("application/json")) {
      const parsed = Body.parse(await req.json());
      email = parsed.email;
      phone = parsed.phone;
    } else {
      const form = await req.formData();
      email = (form.get("email") as string) || undefined;
      phone = (form.get("phone") as string) || undefined;
      const check = Body.safeParse({ email, phone });
      if (!check.success) {
        return NextResponse.json({ ok: false, error: "invalid email/phone" }, { status: 400 });
      }
    }

    if (!email && !phone) {
      return NextResponse.json({ ok: false, error: "email or phone required" }, { status: 400 });
    }

    const canEmail = !!(process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY);
    const canSms = !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN && !!process.env.TWILIO_FROM;

    const notifier = createNotifier();
    const tasks: Promise<any>[] = [];

    if (email && canEmail) {
      const text = "TicketPay: New ticket — $65 · No Parking · Mission & 16th. Pay: https://example.invalid";
      tasks.push(
        notifier.notify({
          channel: "email",
          to: email,
          subject: "TicketPay — example alert",
          text,
          html: `<p>${text}</p>`,
          listUnsubUrl: `${process.env.BASE_URL || "https://ticketpay.us.com"}/unsubscribe/test`,
        })
      );
    }
    if (phone && canSms) {
      const text = "TicketPay: New ticket — $65 · No Parking · Mission & 16th. Pay: https://example.invalid";
      tasks.push(notifier.notify({ channel: "sms", to: phone, text }));
    }

    if (tasks.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No configured provider for requested channel(s)." },
        { status: 400 }
      );
    }

    await Promise.all(tasks);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("send-test error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unexpected error" }, { status: 400 });
  }
}