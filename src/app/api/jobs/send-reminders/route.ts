export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { runReminderSender } from "@/lib/jobs";

export async function POST() {
  const result = await runReminderSender();
  return NextResponse.json(result);
}
