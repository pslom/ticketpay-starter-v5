export function ChannelChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-700 bg-white">
      {children}
    </span>
  );
}

export function ChannelGroup({ channel, paused }: { channel?: "sms" | "email" | "both"; paused?: boolean }) {
  if (paused) return <ChannelChip>Paused</ChannelChip>;
  if (channel === "both") return <div className="flex gap-2"><ChannelChip>SMS</ChannelChip><ChannelChip>Email</ChannelChip></div>;
  if (channel === "sms") return <ChannelChip>SMS</ChannelChip>;
  if (channel === "email") return <ChannelChip>Email</ChannelChip>;
  return null;
}
