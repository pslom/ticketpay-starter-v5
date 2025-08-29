export default function TrustBadges() {
  const Badge = ({children}:{children:React.ReactNode}) => (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[13px] text-neutral-700">
      {children}
    </div>
  );
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <Badge><span>✅</span><span>Secure</span></Badge>
      <Badge><span>🏛️</span><span>Official SF data</span></Badge>
      <Badge><span>↩️</span><span>One-tap unsubscribe</span></Badge>
    </div>
  );
}
