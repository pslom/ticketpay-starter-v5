export function isEmail(v: string): boolean {
  if (!v) return false;
  const s = v.trim();
  // Simple but effective RFC-ish check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

export function normalizeUSPhone(v: string): string | null {
  if (!v) return null;
  const digits = v.replace(/\D+/g, '');
  // Allow 10-digit US, or 11 with leading 1
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}
