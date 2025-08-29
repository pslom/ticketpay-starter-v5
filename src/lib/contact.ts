import crypto from 'crypto';

export function normalizeContact(channel: 'sms'|'email', input: string) {
  const raw = String(input || '').trim();
  if (channel === 'sms') {
    const d = raw.replace(/\D/g, '');
    if (d.length === 10) return `+1${d}`;
    if (d.startsWith('1') && d.length >= 11) return `+${d}`;
    if (raw.startsWith('+') && /^\+\d{11,15}$/.test(raw)) return raw;
    return `+${d}`;
  }
  return raw.toLowerCase();
}

export function hmacContact(norm: string) {
  const secret = process.env.CONTACT_HMAC_SECRET || process.env.MAGIC_TOKEN_SECRET || 'dev';
  return crypto.createHmac('sha256', secret).update(norm).digest('hex');
}
