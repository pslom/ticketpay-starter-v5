export function normalizePlate(raw: string) {
  return raw.replace(/\s+/g, "").toUpperCase();
}
export function normalizeState(raw: string) {
  return raw.trim().toUpperCase();
}
export const CITY_DEFAULT = process.env.CITY_DEFAULT || "SF";
