import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseService";

export async function POST(_:Request,{ params }:{ params:{ id:string } }){
  const s = createServiceClient();
  const { data:{ user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({error:"unauthorized"},{status:401});
  const { data: plate } = await s.from("plates").select("is_paused,user_id").eq("id", params.id).single();
  if (!plate || plate.user_id !== user.id) return NextResponse.json({error:"not found"},{status:404});
  const { error } = await s.from("plates").update({ is_paused: !plate.is_paused }).eq("id", params.id);
  if (error) return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({ ok:true });
}
