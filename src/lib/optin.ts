import crypto from "crypto";

const SECRET = process.env.OPTIN_SECRET || "dev-secret-change-me";

export type PendingPayload = {
  plate: string;
  state: string;
  city?: string;
  channel: "email" | "sms";
  value: string; // email or E.164 phone
};

// compact, url-safe base64
function b64url(buf: Buffer) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function makeToken(data: PendingPayload, ttlSeconds = 60 * 60 * 24) {
  const body = { ...data, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const json = JSON.stringify(body);
  const sig = crypto.createHmac("sha256", SECRET).update(json).digest();
  return `${b64url(Buffer.from(json))}.${b64url(sig)}`;
}

export function verifyToken(token: string): PendingPayload & { exp: number } {
  const [j, s] = token.split(".");
  if (!j || !s) throw new Error("bad_token");
  const jsonBuf = Buffer.from(j.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  const sigBuf = Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  const h = crypto.createHmac("sha256", SECRET).update(jsonBuf).digest();
  if (!crypto.timingSafeEqual(h, sigBuf)) throw new Error("bad_sig");
  const obj = JSON.parse(jsonBuf.toString());
  if (!obj?.exp || obj.exp < Math.floor(Date.now() / 1000)) throw new Error("expired");
  return obj;
}
