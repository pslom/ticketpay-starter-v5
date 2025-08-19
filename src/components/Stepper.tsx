export default function Stepper({step=2}:{step?:1|2|3}) {
  const S = ({n,label,desc}:{n:number;label:string;desc:string}) => (
    <div className={[
      "rounded-2xl border border-black/10 bg-white p-4",
      step===n ? "ring-2 ring-emerald-200" : ""
    ].join(" ")}>
      <div className="font-medium">{n} · {label}</div>
      <div className="tp-micro mt-1">{desc}</div>
    </div>
  );
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <S n={1} label="Search" desc="Enter your plate and state."/>
      <S n={2} label="Subscribe" desc="Add email or SMS for instant alerts."/>
      <S n={3} label="Stay ahead" desc="Act early before late fees hit."/>
    </div>
  );
}
