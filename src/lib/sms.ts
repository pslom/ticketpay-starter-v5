import twilio from 'twilio'
const sid = process.env.TWILIO_ACCOUNT_SID || ''
const token = process.env.TWILIO_AUTH_TOKEN || ''
const fromNumber = process.env.TWILIO_FROM_NUMBER || ''
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID || ''
const client = sid && token ? twilio(sid, token) : null
export async function sendSms(to: string, body: string) {
  if (!client) throw new Error('Twilio not configured')
  const args: any = { to, body }
  if (messagingServiceSid) args.messagingServiceSid = messagingServiceSid
  else args.from = fromNumber
  return client.messages.create(args)
}
