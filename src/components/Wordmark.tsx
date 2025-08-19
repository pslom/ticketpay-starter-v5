import LogoMark from "./Logo";
export default function Wordmark({ className = "" }) {
  return (
    <div className={["flex items-center gap-2", className].join(" ")}>
      <LogoMark className="h-7 w-7" />
      <span className="text-[22px] font-semibold tracking-tight">TicketPay</span>
    </div>
  );
}