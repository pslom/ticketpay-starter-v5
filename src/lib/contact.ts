import crypto from 'crypto';

export function normalizeContact(channel: 'email' | 'sms', contact: string) {
  if (channel === 'email') return String(contact).trim().toLowerCase();
  return String(contact).replace(/[^0-9+]/g, '');
}

export function hmacContact(norm: string) {
  const key = process.env.CONTACT_HMAC_KEY || 'devkey';
  return crypto.createHmac('sha256', key).update(norm).digest('hex');
}
