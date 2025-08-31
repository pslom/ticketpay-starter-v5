export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { sendSubscribeConfirmEmail } from "@/lib/email";
import { query } from "@/lib/pg";
import { normalizePlate, getClientIP } from "@/lib/utils";
import { rateLimit } from "@/lib/ratelimit";
import { sendSMS } from "@/lib/twilio";

type Body = {
  plate?: string;
  state?: string;
  channel?: "email" | "sms";
  value?: string; // email or phone
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req.headers);
    const b = (await req.json().catch(() => ({}))) as Body;
    const plate = (b.plate || "").toUpperCase().trim();
    const state = (b.state || "").toUpperCase().trim();
    const channel = b.channel || (b.value?.includes("@") ? "email" : "sms");
    const value = (b.value || "").trim();

    if (!value)
      return NextResponse.json(
        { ok: false, error: "Enter your email or mobile number." },
        { status: 400 }
      );
    if (channel === "email" && !emailRe.test(value)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email." }, {
        status: 400,
      });
    }

    // TODO: persist to DB (unique on plate/state/channel/value)
    console.info("subscribe", { plate, state, channel, value });

    // Rate limit: 10 requests per 10 minutes
    const rateLimitResult = await rateLimit.limit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: `Too many requests. Please wait ${Math.ceil(
            (rateLimitResult.resetAt - Date.now()) / 1000
          )} seconds.`,
        },
        { status: 429 }
      );
    }

    // Send confirmation email only when available
    if (channel === "email") {
      try {
        await sendSubscribeConfirmEmail(value, plate, state);
      } catch (e) {
        console.error("email.send.failed", e);
        // Still return ok; email isn’t critical to subscription
      }
    }

    // SMS Logic: Send a test SMS (Twilio integration)
    if (channel === "sms") {
      const smsBody = `Your plate: ${plate}, state: ${state}. Confirm your subscription.`;
      try {
        await sendSMS(value, smsBody);
      } catch (e) {
        console.error("sms.send.failed", e);
        // Handle SMS sending error (e.g., log it, notify someone, etc.)
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
