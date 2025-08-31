import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/pg'
import { sendSMS } from '@/lib/twilio'

export async function POST(req: NextRequest) {
  try {
    // Parse Twilio webhook (comes as form data)
    const formData = await req.formData()
    const from = formData.get('From') as string
    const body = (formData.get('Body') as string || '').trim().toUpperCase()
    // ...existing code...
    return new NextResponse('OK', { status: 200 })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return new NextResponse('Error', { status: 500 })
  }
}
// ...existing code...
