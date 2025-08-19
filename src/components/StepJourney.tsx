export default function StepJourney({ active=2 }:{ active?: 1|2|3 }) {
  const Step = ({n, title, body}:{n:number; title:string; body:string}) => (
    <div className={[
      "rounded-2xl border border-black/10 bg-white p-4",
      active===n ? "ring-2 ring-emerald-200" : ""
    ].join(" ")}>
      <div className="font-medium">{n} · {title}</div>
      <div className="tp-micro mt-1">{body}</div>
    </div>
  );
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Step n={1} title="Search" body="Enter your plate and state." />
      <Step n={2} title="Subscribe" body="Add email or SMS for instant alerts." />
      <Step n={3} title="Stay ahead" body="Act early before late fees hit." />
    </div>
  );
}
