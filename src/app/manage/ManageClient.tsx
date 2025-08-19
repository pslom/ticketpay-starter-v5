// src/app/manage/ManageClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import TogglePills from "@/components/TogglePills";
import { ManageCopy, ErrorsCopy } from "@/lib/copy";

type CoreListResponse =
  | { ok: true; subscriptions?: any[]; items?: any[] }
  | { ok: false; error?: string; detail?: string };

type CoreUnsubResponse = { ok: boolean; error?: string; detail?: string };

type Sub = {
  id: string;
  plate?: string;
  state?: string;
  email?: string;
  phone?: string;
  method?: "email" | "sms" | "both" | string;
  createdAt?: string;
  active?: boolean;
};

export default function ManageClient() {
  const [subs, setSubs] = useState<Sub[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<"contact" | "plate">("contact");
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [value, setValue] = useState("");
  const [plate, setPlate] = useState("");
  const [stateVal, setStateVal] = useState("CA");
  const refresh = () => load();
  const [ok, setOk] = useState(false);

  async function core<T>(op: string, extra?: Record<string, any>): Promise<T> {
    const r = await fetch("/api/core", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ op, ...(extra || {}) }),
      cache: "no-store",
    });
    return r.json();
  }

  function normalize(raw: any): Sub {
    // Be defensive: accept both `items` or `subscriptions`, and different field names.
    return {
      id: String(raw.id ?? raw.subscription_id ?? raw._id ?? ""),
      plate: raw.plate ?? raw.license ?? raw.license_plate ?? "",
      state: raw.state ?? raw.plate_state ?? "",
      email: raw.email ?? "",
      phone: raw.phone ?? raw.msisdn ?? "",
      method: raw.method ?? raw.channel ?? (raw.email && raw.phone ? "both" : raw.email ? "email" : raw.phone ? "sms" : ""),
      createdAt: raw.createdAt ?? raw.created_at ?? raw.ts ?? null,
      active: raw.active ?? raw.enabled ?? true,
    };
  }

  function inferChannelFrom(val: string): "email" | "sms" {
    return /@/.test(val) ? "email" : "sms";
  }

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      let data: CoreListResponse;

      if (mode === "contact") {
        const v = value.trim();
        if (!v) throw new Error("Enter your email or phone number");
        const ch = channel || inferChannelFrom(v);
        data = await core<CoreListResponse>("list_subscriptions", { value: v, channel: ch });
      } else {
        const p = plate.trim();
        const s = stateVal.trim();
        if (!p || !s) throw new Error("Enter plate and state");
        data = await core<CoreListResponse>("list_subscriptions", { plate: p, state: s });
      }
      if (!("ok" in data) || !data.ok) {
        const msg = (data as { error?: string })?.error || ErrorsCopy.rateLimit;
        throw new Error(msg);
      }
      const list = (data.subscriptions ?? data.items ?? []).map(normalize);
      setSubs(list);
      setOk(true);
    } catch (e: any) {
      setErr(e?.message || "Failed to load alerts");
      setSubs([]);
      setOk(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // On first load, try to hydrate from URL query params (?value=&channel= or ?plate=&state=)
    try {
  const sp = new URLSearchParams(window.location.search);
      const qpValue = (sp.get("value") || "").trim();
      const qpChannel = (sp.get("channel") || "").trim() as "email" | "sms";
      const qpPlate = (sp.get("plate") || "").trim();
      const qpState = (sp.get("state") || "").trim();
      if (qpValue) {
        setMode("contact");
        setValue(qpValue);
        setChannel(qpChannel || inferChannelFrom(qpValue));
        void (async () => { await load(); })();
      } else if (qpPlate && qpState) {
        setMode("plate");
        setPlate(qpPlate);
        setStateVal(qpState);
        void (async () => { await load(); })();
      } else {
        // No query — show empty state; don't auto-call to avoid validation_error
        setSubs([]);
      }
    } catch {
      setSubs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onRemove(id: string) {
    setBusyIds((m) => ({ ...m, [id]: true }));
    setErr(null);
    try {
      const res = await core<CoreUnsubResponse>("unsubscribe", { id });
      if (!res.ok) throw new Error(res.error || res.detail || "unsubscribe failed");
      setSubs((list) => (list ? list.filter((s) => s.id !== id) : list));
    } catch (e: any) {
      setErr(e?.message || "Failed to remove alert");
    } finally {
      setBusyIds((m) => {
        const { [id]: _, ...rest } = m;
        return rest;
      });
    }
  }

  const rows = useMemo(() => subs ?? [], [subs]);

  return (
    <section className="space-y-4">
      {/* Lookup controls */}
      <div className="rounded border p-3">
        <div className="flex items-center justify-between gap-4">
          <TogglePills
            value={mode}
            onChange={(v) => setMode(v as any)}
            options={[
              { label: ManageCopy.modeContact, value: "contact" },
              { label: ManageCopy.modePlate, value: "plate" },
            ]}
          />
        </div>

        {mode === "contact" ? (
          <>
            <label className="block mt-4 text-sm font-medium">Channel</label>
            <TogglePills
              className="mt-2"
              value={channel}
              onChange={(v) => setChannel(v as any)}
              options={[
                { label: ManageCopy.channelEmail, value: "email" },
                { label: ManageCopy.channelSms, value: "sms" },
              ]}
            />
            <div className="mt-4">
              <label className="text-sm font-medium" htmlFor="contact">
                {channel === "email" ? "Email address" : "Mobile number"}
              </label>
              <input
                id="contact"
                className="tp-input mt-1"
                placeholder={channel === "email" ? ManageCopy.inputContactPlaceholder : "(415) 555-0123"}
                inputMode={channel === "email" ? "email" : "tel"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <div className="mt-3">
                <button onClick={load} className="tp-btn" disabled={loading}>
                  Find
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <label className="text-sm font-medium" htmlFor="plate">Plate / State</label>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input
                id="plate"
                className="tp-input mt-1"
                placeholder={ManageCopy.inputPlatePlaceholder}
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
              />
              <select
                className="tp-input w-28 mt-1"
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
              >
                <option>CA</option>
              </select>
            </div>
            <div className="mt-3">
              <button onClick={load} className="tp-btn" disabled={loading}>
                Find
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{ManageCopy.listTitle}</h2>
        <button onClick={refresh} className="rounded-full border px-3 py-1.5 text-sm" disabled={loading}>
          {ManageCopy.refresh}
        </button>
      </div>

      {err && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {err}
        </div>
      )}

      {loading && !subs && <p className="text-neutral-600">Loading your alerts…</p>}

  {subs && rows.length === 0 && !loading && !err && !ok && (
        <p className="mt-2 text-sm text-gray-600">
          {ManageCopy.noneTitle} {ManageCopy.noneBody}
        </p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left p-2">Plate</th>
                <th className="text-left p-2">State</th>
                <th className="text-left p-2">Method</th>
                <th className="text-left p-2">Destination</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.plate || "—"}</td>
                  <td className="p-2">{s.state || "—"}</td>
                  <td className="p-2 capitalize">{s.method || "—"}</td>
                  <td className="p-2">
                    {s.method === "email" ? s.email :
                     s.method === "sms" ? s.phone :
                     s.method === "both" ? [s.email, s.phone].filter(Boolean).join(" + ") :
                     s.email || s.phone || "—"}
                  </td>
                  <td className="p-2">{s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}</td>
                  <td className="p-2">
                    <button
                      onClick={() => onRemove(s.id)}
                      disabled={!!busyIds[s.id]}
                      className="rounded border px-2 py-1 hover:bg-black/5 disabled:opacity-50"
                      aria-label={`Remove alert ${s.id}`}
                    >
                      {busyIds[s.id] ? "Removing…" : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
