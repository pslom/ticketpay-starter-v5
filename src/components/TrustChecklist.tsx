import { Shield, Lock, Dot } from "./icons";

export default function TrustChecklist() {
  const Item = ({icon, text}:{icon:React.ReactNode; text:string}) => (
    <li className="flex items-center gap-2 text-white/95">
      <span className="inline-flex h-6 w-6 items-center justify-center">{icon}</span>
      <span className="text-[16px] font-medium">{text}</span>
    </li>
  );
  return (
    <ul className="space-y-3 mt-6">
      <Item icon={<Shield className="text-white"/>} text="Secure" />
      <Item icon={<Lock className="text-white"/>} text="Private" />
      <Item icon={<Dot className="text-white"/>} text="One-tap unsubscribe" />
    </ul>
  );
}
