export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    datasf_dataset_ID: !!process.env.datasf_dataset_ID,
    datasf_app_token: !!process.env.datasf_app_token,
    supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    twilio: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN && !!process.env.TWILIO_MESSAGING_SERVICE_SID,
    sendgrid: !!process.env.SENDGRID_API_KEY && !!process.env.EMAIL_FROM
  });
}
