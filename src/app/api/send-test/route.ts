export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmailPreview } from "@/lib/notify";

const Body = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = Body.parse(await req.json());

    if (body.email && process.env.RESEND_API_KEY) {
      await sendEmailPreview(body.email);
    }
    // When SMS is ready:
    // if (body.phone && process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
    //   await sendSmsPreview(body.phone);
    // }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
