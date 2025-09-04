import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseService";

export async function GET(){
  const s = createServiceClient();
  const { data:{ user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({ tickets: [] });

  // only user tickets via the view
  const { data } = await s.from("v_user_due_tickets")
    .select("id,vehicle_plate,analysis_neighborhood,violation,violation_desc,citation_issued_datetime,fine_amount,due_date,status")
    .eq("user_id", user.id)
    .order("citation_issued_datetime", { ascending:false })
    .limit(20);

  return NextResponse.json({ tickets: data ?? [] });
}
