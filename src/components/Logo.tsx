export default function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="6" />
      <text x="50%" y="57%" textAnchor="middle" fontSize="46" fontWeight="700" fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial">
        TP
      </text>
    </svg>
  );
}
