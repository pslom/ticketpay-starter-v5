export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl shadow-card bg-white p-4 md:p-6">{children}</div>;
}
