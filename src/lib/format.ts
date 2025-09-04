export function formatUSPhone(input: string) {
  const digits = input.replace(/\D/g, '').slice(0, 11); // allow leading 1
  const d = digits[0] === '1' ? digits.slice(1) : digits;
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (!a) return '';
  if (!b) return `(${a}`;
  if (!c) return `(${a}) ${b}`;
  return `(${a}) ${b}-${c}`;
}

export const formatUSD = (n = 0) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
