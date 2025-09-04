import { NextResponse } from 'next/server'
import { queryCitationsByPlate, isoSinceYesterdayUTC } from '@/lib/sfdata'

export async function GET() {
  try {
    const rows = await queryCitationsByPlate({
      plate: '6SRX057',   // replace with any real plate from the dataset
      state: 'CA',
      limit: 3,
    })
    return NextResponse.json({ ok: true, count: rows.length, sample: rows })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
