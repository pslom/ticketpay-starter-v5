import { NextResponse } from 'next/server'
import twilio from 'twilio'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH!)

export async function POST(req: Request) {
  const { plate, state, channel, contact } = await req.json()

  try {
    if (channel === 'sms') {
      const to = '+1' + String(contact).replace(/[^\d]/g, '').replace(/^1/, '')
      await client.messages.create({
        from: process.env.TWILIO_FROM!,
        to,
        body: `TicketPay: Confirm SMS alerts for ${state} ${plate}. Reply YES to start. Text STOP to cancel, HELP for help.`,
      })
    } else {
      // For MVP: stub. If you wire email later, send your confirmation email here.
      // Keeping a 200 response for UX.
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
