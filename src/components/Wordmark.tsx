/**
 * TicketPay Wordmark
 * - Subtle "TP" ring + clean wordmark
 * - Gradient underline for a designed-but-professional feel
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`} aria-label="TicketPay">
      {/* TP ring (kept minimal) */}
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient id="tpGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="14" fill="none" stroke="url(#tpGrad)" strokeWidth="2.5" />
        <text
          x="50%" y="57%"
          textAnchor="middle"
          fontSize="13" fontWeight="700"
          fontFamily="system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial"
          fill="currentColor"
        >
          TP
        </text>
      </svg>

      {/* Wordmark */}
      <div className="leading-none">
        <div className="font-semibold tracking-tight">TicketPay</div>
        <div
          className="h-[3px] w-full rounded-full mt-[3px]"
          style={{ background: "linear-gradient(90deg,#667eea,#764ba2)" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
