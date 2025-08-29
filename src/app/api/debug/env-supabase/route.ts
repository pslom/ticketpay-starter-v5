export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET() {
  const url1 = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const url2 = process.env.SUPABASE_URL || "";
  const chosen = url2 || url1;
  let ok = false, err = "";
  try { new URL(chosen); ok = true; } catch (e:any) { err = String(e?.message||e); }
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL_present: !!url1,
    SUPABASE_URL_present: !!url2,
    chosen_preview: chosen.slice(0, 40),
    url_parses: ok,
    url_error: err || null,
    SERVICE_ROLE_present: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });
}
