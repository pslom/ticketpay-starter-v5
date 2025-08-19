export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createNotifier } from "@/lib/notifier";
import { subscribeSchema } from "@/lib/validation";
import { z } from "zod";

type Body = {
  plate?: string;
  state?: string;
  channel?: "email" | "sms";
  value?: string; // email or phone
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Use .strict() instead of .passthrough() if you want to block extra fields
const lookupSchema = z.object({ /* fields */ }).strict();

export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => null);
    const parsed = subscribeSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        {
          ok: false,
          error: "invalid_body",
          issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
        },
        { status: 400 },
      );
    }
    const { plate, state, city, channel, value } = parsed.data;

    const upperPlate = (plate || "").toUpperCase().trim();
    const upperState = (state || "").toUpperCase().trim();
    const upperChannel = channel || (value?.includes("@") ? "email" : "sms");
    const upperValue = (value || "").trim();

    if (!upperValue)
      return NextResponse.json(
        { ok: false, error: "Enter your email or mobile number." },
        { status: 400 }
      );
    if (upperChannel === "email" && !emailRe.test(upperValue)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email." }, {
        status: 400,
      });
    }

  // TODO: persist to DB (unique on plate/state/channel/value)
  console.info("subscribe", { plate: upperPlate, state: upperState, channel: upperChannel, value: upperValue });

    // Send confirmation email only when available via unified notifier
    if (upperChannel === "email") {
      try {
        const confirmUrl = `${process.env.BASE_URL || "https://ticketpay.us.com"}/optin/confirm?plate=${encodeURIComponent(upperPlate)}&state=${encodeURIComponent(upperState)}&value=${encodeURIComponent(upperValue)}`;
        const notifier = createNotifier();
        const subject = "Confirm TicketPay alerts";
        const text = `Confirm alerts for plate ${upperPlate} (${upperState}).\n${confirmUrl}`;
        const html = `
          <div style="font-family:system-ui,Segoe UI,Arial">
            <h2>Confirm TicketPay alerts</h2>
            <p>Confirm alerts for plate <b>${upperPlate}</b> (${upperState}).</p>
            <p><a href="${confirmUrl}" style="display:inline-block;padding:10px 14px;background:#000;color:#fff;border-radius:10px;text-decoration:none">Confirm alerts</a></p>
            <p style="font-size:12px;color:#666;margin-top:16px">Questions? Reply to this email and we’ll help: ${process.env.MAIL_REPLY_TO || process.env.MAIL_FROM_EMAIL || "info@ticketpay.us.com"}</p>
          </div>`;
        await notifier.notify({ channel: "email", to: upperValue, subject, text, html });
      } catch (e) {
        console.error("email.send.failed", e);
        // Still return ok; email isn’t critical to subscription
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(String(e));
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
