// Utility functions
export function normalizePlate(plate: string): string {
  return plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
}

export function formatCents(cents: number) {
  const v = Number.isFinite(cents) ? cents : 0;
  return (v / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });
}
