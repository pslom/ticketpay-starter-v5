export function normPlate(s: string) {
  return (s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}
export function normState(s: string) {
  return (s || "").toUpperCase();
}
