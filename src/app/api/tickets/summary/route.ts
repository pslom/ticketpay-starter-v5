import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseService";

export async function GET(){
  const s = createServiceClient();
  const { data:{ user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({ monitored:0, activeTickets:0, dueSoon:0, lastImport:null });

  const [{ data: plates }, { data: active }, { data: due }, { data: j }] = await Promise.all([
    s.from("plates").select("id").eq("user_id", user.id).eq("active", true),
    s.from("v_user_due_tickets").select("id").eq("user_id", user.id).eq("status","active"),
    s.from("v_user_due_tickets").select("id").eq("user_id", user.id).eq("status","active").gte("due_date", new Date().toISOString().slice(0,10)).lte("due_date", new Date(Date.now()+5*86400000).toISOString().slice(0,10)),
    s.from("jurisdiction").select("last_import").eq("name","San Francisco").eq("state","CA").limit(1).single(),
  ]);

  return NextResponse.json({
    monitored: plates?.length ?? 0,
    activeTickets: active?.length ?? 0,
    dueSoon: due?.length ?? 0,
    lastImport: j?.last_import ? new Date(j.last_import).toLocaleString() : null
  });
}
