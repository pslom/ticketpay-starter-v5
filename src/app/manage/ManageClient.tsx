// src/app/manage/ManageClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
  const [state, setState] = useState("");

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
        const s = state.trim();
        if (!p || !s) throw new Error("Enter plate and state");
        data = await core<CoreListResponse>("list_subscriptions", { plate: p, state: s });
      }
      if (!("ok" in data) || !data.ok) {
        throw new Error((data as any)?.error || (data as any)?.detail || "list failed");
      }
      const list = (data.subscriptions ?? data.items ?? []).map(normalize);
      setSubs(list);
    } catch (e: any) {
      setErr(e?.message || "Failed to load alerts");
      setSubs([]);
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
        setState(qpState);
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage your alerts</h2>
        <button onClick={() => load()} className="rounded border px-3 py-1.5 text-sm hover:bg-black/5" disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Lookup controls */}
      <div className="rounded border p-3 space-y-3">
        <div className="flex gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="mode" value="contact" checked={mode === "contact"} onChange={() => setMode("contact")} />
            <span>By contact</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="mode" value="plate" checked={mode === "plate"} onChange={() => setMode("plate")} />
            <span>By plate/state</span>
          </label>
        </div>

        {mode === "contact" ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="channel" value="email" checked={channel === "email"} onChange={() => setChannel("email")} />
                <span>Email</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="channel" value="sms" checked={channel === "sms"} onChange={() => setChannel("sms")} />
                <span>SMS</span>
              </label>
            </div>
            <input
              className="w-full max-w-sm rounded border px-3 py-2"
              placeholder={channel === "email" ? "you@example.com" : "(415) 555-0123"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputMode={channel === "email" ? "email" : "tel"}
            />
            <button onClick={() => load()} className="rounded border px-3 py-2 text-sm hover:bg-black/5" disabled={loading}>
              Find
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <input
              className="w-full max-w-xs rounded border px-3 py-2"
              placeholder="Plate"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
            />
            <input
              className="w-full max-w-[8rem] rounded border px-3 py-2"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <button onClick={() => load()} className="rounded border px-3 py-2 text-sm hover:bg-black/5" disabled={loading}>
              Find
            </button>
          </div>
        )}
      </div>

      {err && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {err}
        </div>
      )}

      {loading && !subs && <p className="text-neutral-600">Loading your alerts…</p>}

  {subs && rows.length === 0 && (
        <div className="rounded-md border p-4 text-sm">
          <p>You don’t have any active alerts yet.</p>
          <p className="mt-2">
            <Link href="/" className="underline">Set up a reminder</Link>
          </p>
        </div>
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
