export function getIncomingToken(req: Request): string {
  const url = new URL(req.url);
  const q = (url.searchParams.get("token") || "").trim();
  if (q) return q;
  const h = (req.headers.get("x-debug-token") || "").trim();
  if (h) return h;
  const auth = (req.headers.get("authorization") || "").trim();
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return "";
}
export function getExpectedToken(): string {
  return (process.env.DEBUG_TOKEN || "").trim();
}
