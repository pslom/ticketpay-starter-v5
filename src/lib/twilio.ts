import twilio from 'twilio'

let client: twilio.Twilio | null = null

export function getTwilioClient() {
  if (!client) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    
    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured')
    }
    
    client = twilio(accountSid, authToken)
  }
  return client
}

export async function sendSMS(to: string, body: string) {
  const client = getTwilioClient()
  const from = process.env.TWILIO_FROM
  
  if (!from) {
    throw new Error('TWILIO_FROM not configured')
  }
  
  // Ensure US format
  const toNumber = to.startsWith('+1') ? to : `+1${to.replace(/\D/g, '')}`
  
  try {
    const message = await client.messages.create({
      body,
      from,
      to: toNumber,
      statusCallback: `${process.env.BASE_URL}/api/verify/status`
    })
    
    return { success: true, sid: message.sid }
  } catch (error: any) {
    console.error('SMS send error:', error)
    
    // Handle specific Twilio errors
    if (error.code === 21211) {
      throw new Error('Invalid phone number')
    }
    if (error.code === 21608) {
      throw new Error('Number is unsubscribed')
    }
    
    throw new Error('Failed to send SMS')
  }
}
