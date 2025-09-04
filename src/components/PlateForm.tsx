"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM",
  "NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA",
  "WV","WI","WY"
];

export default function PlateForm() {
  const router = useRouter();
  const [state, setState] = useState("CA");
  const [plate, setPlate] = useState("");

  const canSubmit = plate.trim().length >= 1;

  const onStart = () => {
    if (!canSubmit) return;
    // Product rule: go collect contact unless we find a verified sub.
    // For now, send to subscribe with state+plate.
    router.push(`/subscribe?state=${state}&plate=${encodeURIComponent(plate.trim().toUpperCase())}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[110px_1fr] gap-3">
        <div className="relative">
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-3 py-3 bg-white"
          >
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <input
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          onBlur={() => setPlate((p) => p.trim().toUpperCase())}
          placeholder="7ABC123"
          className="w-full rounded-xl border border-neutral-200 px-4 py-3 bg-white"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onStart}
          disabled={!canSubmit}
          className={`rounded-xl px-4 py-3 text-white ${canSubmit ? "bg-emerald-600 hover:bg-emerald-700" : "bg-neutral-300 cursor-not-allowed"}`}
        >
          Start alerts
        </button>
        <a
          href="https://wmq.etimspayments.com/pbw/include/sanfrancisco/input.jsp"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-neutral-200 px-4 py-3"
        >
          Pay at SFMTA
        </a>
      </div>

      <p className="text-xs text-neutral-500">
        By starting, you agree to our{" "}
        <a className="underline hover:text-neutral-700" href="/trust">Trust & safety</a>.
        SMS (if chosen): recurring messages; reply STOP to cancel, HELP for help; message & data rates may apply.
      </p>
      <p className="text-xs text-neutral-500">
        US plates welcome. Alerts apply to SFMTA tickets only.
      </p>
    </div>
  );
}
