export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function GET() {
  const s = getSupabaseServer();
  async function ping(table: string) {
    const { error, count } = await s.from(table).select("*", { count: "exact", head: true });
    return { table, ok: !error, count: count ?? null, code: (error as any)?.code || null, message: error?.message || null };
  }
  const a = await ping("subscriptions");
  const b = await ping("sub_citations");
  const c = await ping("messages");
  return NextResponse.json({ tables: [a, b, c] });
}
