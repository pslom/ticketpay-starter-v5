const ALLOWED_HOSTS = new Set([
  "wmq.etimspayments.com",
  "www.sfmta.com",
  "sfmta.com"
]);

export function isAllowedPayUrl(url: string) {
  try {
    const u = new URL(url);
    return ALLOWED_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}
