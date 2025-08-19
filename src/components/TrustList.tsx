function Item({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-2 text-white/95">
      <span aria-hidden className="inline-flex h-6 w-6 items-center justify-center">{icon}</span>
      <span className="text-[16px] font-medium">{text}</span>
    </li>
  );
}

export default function TrustList() {
  return (
    <ul className="space-y-3 mt-6">
      <Item text="Secure" icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" stroke="white" strokeWidth="2"/><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" /></svg>
      }/>
      <Item text="Private" icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="10" rx="2" stroke="white" strokeWidth="2"/><path d="M8 10V8a4 4 0 118 0v2" stroke="white" strokeWidth="2"/></svg>
      }/>
      <Item text="One-tap unsubscribe" icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="2" fill="white"/></svg>
      }/>
    </ul>
  );
}
