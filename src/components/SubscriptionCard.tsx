import { Plate, Sms, Mail } from "./icons";

export default function SubscriptionCard({
  plate, state, channel, destination, onUnsub,
}: { plate:string; state:string; channel:'sms'|'email'; destination:string; onUnsub:()=>void; }) {
  const Chip = ({children}:{children:React.ReactNode}) => <span className="tp-chip">{children}</span>;
  return (
    <li className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <Plate className="text-neutral-700"/>
        <div>
          <div className="font-medium">{plate} ({state})</div>
          <div className="mt-1 flex items-center gap-2">
            <Chip>{channel === 'sms' ? <><Sms/> SMS</> : <><Mail/> Email</>}</Chip>
            <span className="tp-micro">{destination}</span>
          </div>
        </div>
      </div>
      <button onClick={onUnsub} className="rounded-xl border px-3 py-2 text-sm">Unsubscribe</button>
    </li>
  );
}
