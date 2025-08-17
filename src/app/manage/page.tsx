"use client";

import { useEffect, useState } from "react";import { useEffect, useState } from 'react';

type Sub = {
  id: string;
  plate: string;channel: 'sms'|'email'; value: string; city: string; created_at: string;
  plate_normalized: string;};
  state: string;
  channel: "sms" | "email";
  value: string;
  city: string;email'>('sms');
  created_at: string;
};e);
  const [err, setErr] = useState<string>('');
export default function ManagePage() {
  const [value, setValue] = useState("");
  const [channel, setChannel] = useState<"sms" | "email">("sms");r(''); setLoading(true);
  const [items, setItems] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(false);etch('/api/core', {
  const [err, setErr] = useState<string>("");

  async function load() {ody: JSON.stringify({ op: 'list_subscriptions', value, channel })
    setErr("");
    setLoading(true);
    try {or(j.error || 'server_error');
      const r = await fetch("/api/core", {s || []);
        method: "POST",
        headers: { "content-type": "application/json" },);
        body: JSON.stringify({ op: "list_subscriptions", value, channel }), } finally { setLoading(false); }
      });  }
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "server_error");(id: string) {
      setItems(j.items || []);
    } catch (e: any) {ems(prev.filter(x => x.id !== id));
      setErr(String(e?.message || e));
    } finally {etch('/api/core', {
      setLoading(false);
    },
  }ody: JSON.stringify({ op: 'unsubscribe', id })

  async function remove(id: string) {
    const prev = items;throw new Error(j.error || 'server_error');
    setItems(prev.filter((x) => x.id !== id));
    try {error
      const r = await fetch("/api/core", {
        method: "POST", alert('Unsubscribe failed. Please try again.');
        headers: { "content-type": "application/json" }, }
        body: JSON.stringify({ op: "unsubscribe", id }),  }
      });
      const j = await r.json();  useEffect(() => { /* no-op */ }, []);
      if (!j.ok) throw new Error(j.error || "server_error");
    } catch (e) {
      // rollback on error
      setItems(prev);      <h1 className="text-2xl font-semibold">Manage alerts</h1>
      alert("Unsubscribe failed. Please try again.");
    }
  }-sm font-medium">Channel</label>

  useEffect(() => {
    /* no-op */put type="radio" name="channel" checked={channel==='sms'} onChange={()=>setChannel('sms')} />
  }, []);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">t type="radio" name="channel" checked={channel==='email'} onChange={()=>setChannel('email')} />
      <h1 className="text-2xl font-semibold">Manage alerts</h1>
bel>
      <div className="rounded-2xl p-4 shadow bg-white space-y-3">        </div>
        <label className="block text-sm font-medium">Channel</label>
        <div className="flex gap-3">
          <label className="inline-flex items-center gap-2">el === 'sms' ? 'Phone number (E.164, e.g. +15555551234)' : 'Email'}
            <inputl>
              type="radio"
              name="channel"
              checked={channel === "sms"}ou@example.com'}
              onChange={() => setChannel("sms")}value={value} onChange={e=>setValue(e.target.value)}
            />
            SMS
          </label>ck text-white px-4 py-2 disabled:opacity-50"
          <label className="inline-flex items-center gap-2">ue || loading}
            <input onClick={load}
              type="radio"
              name="channel"g ? 'Loading…' : 'Find subscriptions'}
              checked={channel === "email"}        </button>
              onChange={() => setChannel("email")}
            /> && <p className="text-red-600 text-sm break-words">{err}</p>}
            Email      </div>
          </label>
        </div>

        <label className="block text-sm font-medium">nt-medium mb-3">Your subscriptions</h2>
          {channel === "sms"-y">
            ? "Phone number (E.164, e.g. +15555551234)"
            : "Email"}"py-3 flex items-center justify-between">
        </label>
        <inpute}</div>
          className="w-full rounded-xl border p-2"
          placeholder={ className="text-gray-400 text-xs">Created {new Date(sub.created_at).toLocaleString()}</div>
            channel === "sms" ? "+15555551234" : "you@example.com"
          }
          value={value} px-3 py-1 hover:bg-gray-50"
          onChange={(e) => setValue(e.target.value)} onClick={()=>remove(sub.id)}
        />
        <buttonribe
          className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50"utton>
          disabled={!value || loading}/li>
          onClick={load}
        >>
          {loading ? "Loading…" : "Find subscriptions"}</div>
        </button>      )}

        {err && (
          <p className="text-red-600 text-sm break-words">{err}</p><p className="text-gray-600">No subscriptions yet. Search above to view yours.</p>
        )}
      </div></main>
 );
      {items.length > 0 && (}









































}  );    </main>      )}        </p>          No subscriptions yet. Search above to view yours.        <p className="text-gray-600">      {items.length === 0 && !loading && !err && (      )}        </div>          </ul>            ))}              </li>                </button>                  Unsubscribe                >                  onClick={() => remove(sub.id)}                  className="rounded-xl border px-3 py-1 hover:bg-gray-50"                <button                </div>                  </div>                    {new Date(sub.created_at).toLocaleString()}                    Created{" "}                  <div className="text-gray-400 text-xs">                  </div>                    {sub.channel}: {sub.value}                  <div className="text-gray-600">                  </div>                    {sub.plate_normalized} · {sub.state}                  <div className="font-medium">                <div className="text-sm">              >                className="py-3 flex items-center justify-between"                key={sub.id}              <li            {items.map((sub) => (          <ul className="divide-y">          <h2 className="text-lg font-medium mb-3">Your subscriptions</h2>        <div className="rounded-2xl p-4 shadow bg-white">