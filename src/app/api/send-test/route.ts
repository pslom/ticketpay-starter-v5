export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmailPreview, sendSmsPreview } from "@/lib/notify";

const Body = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { email, phone } = Body.parse(await req.json());

    if (!email && !phone) {
      return NextResponse.json({ ok: false, error: "email or phone required" }, { status: 400 });
    }

    const canEmail = !!(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM);
    const canSms =
      !!process.env.TWILIO_ACCOUNT_SID &&
      !!process.env.TWILIO_AUTH_TOKEN &&
      !!process.env.TWILIO_FROM;

    const tasks: Promise<any>[] = [];
    if (email && canEmail) tasks.push(sendEmailPreview(email));
    if (phone && canSms) tasks.push(sendSmsPreview(phone));

    if (tasks.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No configured provider for requested channel(s)." },
        { status: 400 }
      );
    }

    await Promise.all(tasks);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? "unexpected error" }, { status: 400 });
  }
}
