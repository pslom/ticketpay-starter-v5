import crypto from 'crypto';

function b64url(input: Buffer) {
  return input.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function b64urlDecode(s: string) {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  return Buffer.from(s.replace(/-/g,'+').replace(/_/g,'/') + pad, 'base64');
}

export type MagicPayload = {
  subId?: string;
  plate: string;
  state: string;
  channel: 'sms'|'email';
  ts: number;
};

export function signMagic(p: MagicPayload) {
  const secret = process.env.MAGIC_TOKEN_SECRET || 'dev';
  const header = b64url(Buffer.from(JSON.stringify({ alg:'HS256', typ:'JWT' })));
  const payload = b64url(Buffer.from(JSON.stringify(p)));
  const data = `${header}.${payload}`;
  const sig = crypto.createHmac('sha256', secret).update(data).digest();
  const token = `${data}.${b64url(sig)}`;
  return token;
}

export function verifyMagic(token: string): MagicPayload | null {
  try {
    const secret = process.env.MAGIC_TOKEN_SECRET || 'dev';
    const [h, p, s] = token.split('.');
    if (!h || !p || !s) return null;
    const data = `${h}.${p}`;
    const expected = crypto.createHmac('sha256', secret).update(data).digest();
    const given = b64urlDecode(s);
    if (!crypto.timingSafeEqual(expected, given)) return null;
    const payload = JSON.parse(b64urlDecode(p).toString());
    if (!payload || typeof payload.ts !== 'number') return null;
    return payload;
  } catch {
    return null;
  }
}
