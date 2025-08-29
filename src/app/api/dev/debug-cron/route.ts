export const runtime = 'nodejs';
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const headerRaw = req.headers.get('x-cron-secret') ?? null
  const envRaw = process.env.CRON_SECRET ?? null

  const info = (v: string | null) =>
    v === null ? null : { value: v, len: v.length, b64: Buffer.from(v).toString('base64') }

  return NextResponse.json({ header: info(headerRaw), env: info(envRaw) })
}
