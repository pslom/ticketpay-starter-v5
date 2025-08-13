export function formatCents(cents: number) {
  const v = Number.isFinite(cents) ? cents : 0;
  return (v / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });
}
