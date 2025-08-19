export const runtime = "nodejs";
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  const envAllow = (process.env.ALLOW_SELF_SIGNED_TLS || "").trim();
  const allowSelfSigned = envAllow === "1";
  const caText = (process.env.SUPABASE_CA_PEM || "").trim();
  const caFile = (process.env.SUPABASE_CA_PEM_FILE || "").trim();
  let caFileExists = false;
  if (caFile) {
    try {
      const p = path.isAbsolute(caFile) ? caFile : path.resolve(process.cwd(), caFile);
      caFileExists = fs.existsSync(p);
    } catch {}
  }

  let mode: "ALLOW_SELF_SIGNED" | "PINNED_CA" | "STRICT_VERIFY";
  if (allowSelfSigned) mode = "ALLOW_SELF_SIGNED";
  else if (caText || caFileExists) mode = "PINNED_CA";
  else mode = "STRICT_VERIFY";

  return NextResponse.json({
    ok: true,
    NODE_ENV: process.env.NODE_ENV || null,
    ALLOW_SELF_SIGNED_TLS: envAllow || null,
    SUPABASE_CA_PEM_present: caText.length > 0,
    SUPABASE_CA_PEM_file_var: caFile || null,
    SUPABASE_CA_PEM_file_exists: caFileExists,
    mode,
  });
}
