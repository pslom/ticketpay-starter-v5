export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sendSubscribeConfirmEmail } from "@/lib/email";
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

    // Send confirmation email only when available
    if (upperChannel === "email") {
      try {
        await sendSubscribeConfirmEmail(upperValue, upperPlate, upperState);
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
