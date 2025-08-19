"use client";

import React from "react";
import TogglePills from "@/components/TogglePills";
import SubscriptionCard from "@/components/SubscriptionCard";
import { ManageCopy, ErrorsCopy } from "@/lib/copy";
import { track, EVENTS } from "@/lib/track";

type Item = { id:string; plate:string; state:string; channel:'sms'|'email'; destination:string };

export const dynamic = "force-dynamic";

export default function ManagePage() {
  const [mode, setMode] = React.useState<"contact"|"plate">("contact");
  const [channel, setChannel] = React.useState<"email"|"sms">("email");
  const [value, setValue] = React.useState("");
  const [plate, setPlate] = React.useState("");
  const [stateVal, setStateVal] = React.useState("CA");
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(()=>{ track(EVENTS.MANAGE_VIEW); },[]);

  async function load() {
    try {
      setLoading(true); setErr(null);
      const body = mode === "contact"
        ? { op: "list_subscriptions", value: value.trim(), channel }
        : { op: "list_subscriptions", plate: plate.trim(), state: stateVal.trim() };
      const r = await fetch("/api/core", { method:"POST", body: JSON.stringify(body) });
      const j = await r.json();
      if (!r.ok) throw new Error((j && j.error) || ErrorsCopy.rateLimit);
      setItems(Array.isArray(j?.items) ? j.items : []);
    } catch (e:any) { setErr(e.message || ErrorsCopy.generic); } 
    finally { setLoading(false); }
  }
  const refresh = () => load();

  async function unsub(id:string) {
    track(EVENTS.UNSUBSCRIBE_CLICK);
    await fetch("/api/core", { method:"POST", body: JSON.stringify({ op:"unsubscribe", id }) });
    setItems(prev => prev.filter(i => i.id !== id));
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">{ManageCopy.title}</h1>
      <p className="mt-2 text-neutral-700">{ManageCopy.subtitle}</p>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <TogglePills
            value={mode}
            onChange={(v)=>setMode(v as any)}
            options={[{label: ManageCopy.modeContact, value:"contact"},{label: ManageCopy.modePlate, value:"plate"}]}
          />
        </div>

        {mode === "contact" ? (
          <>
            <label className="block mt-4 text-sm font-medium">Channel</label>
            <TogglePills
              className="mt-2"
              value={channel}
              onChange={(v)=>setChannel(v as any)}
              options={[{label: ManageCopy.channelEmail, value:"email"},{label: ManageCopy.channelSms, value:"sms"}]}
            />
            <div className="mt-4">
              <label className="text-sm font-medium" htmlFor="contact">
                {channel === "email" ? "Email address" : "Mobile number"}
              </label>
              <input id="contact" className="tp-input mt-1"
                     placeholder={ManageCopy.inputContactPlaceholder}
                     inputMode={channel === "email" ? "email" : "tel"}
                     value={value} onChange={(e)=>setValue(e.target.value)} />
              <button onClick={load} className="tp-btn mt-3">{ManageCopy.ctaFind}</button>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <label className="text-sm font-medium" htmlFor="plate">Plate / State</label>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input id="plate" className="tp-input mt-1" placeholder={ManageCopy.inputPlatePlaceholder}
                     value={plate} onChange={(e)=>setPlate(e.target.value)} />
              <select className="tp-input w-28 mt-1" value={stateVal} onChange={(e)=>setStateVal(e.target.value)}>
                <option>CA</option>
              </select>
            </div>
            <button onClick={load} className="tp-btn mt-3">{ManageCopy.ctaFind}</button>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{ManageCopy.listTitle}</h2>
          <button onClick={refresh} className="rounded-full border px-3 py-1.5 text-sm">{ManageCopy.refresh}</button>
        </div>

        {loading && <p className="mt-3 text-sm text-neutral-700">Loading…</p>}
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        {!loading && !err && items.length === 0 && (
          <p className="mt-3 text-sm text-neutral-700">{ManageCopy.noneTitle} {ManageCopy.noneBody}</p>
        )}

        <ul className="mt-3 space-y-2">
          {items.map(it => (
            <SubscriptionCard key={it.id} {...it} onUnsub={()=>unsub(it.id)} />
          ))}
        </ul>
      </div>
    </main>
  );
}
