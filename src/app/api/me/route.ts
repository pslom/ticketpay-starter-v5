import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseService";

export async function GET(){
  const s = createServiceClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 200 });
  const { data: p } = await s.from("profiles").select("phone_verified").eq("id", user.id).single();
  return NextResponse.json({ phone_verified: p?.phone_verified ?? false });
}
