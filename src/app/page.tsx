"use client";
import { useState } from "react";
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';

function formatCents(cents:number){return (cents/100).toLocaleString(undefined,{style:"currency",currency:"USD"});}

type Ticket={id:string;citation_number:string;status:string;amount_cents:number;issued_at:string;location:string|null;violation:string|null;city:string};

export default function Home(){
  const [plate,setPlate]=useState("");
  const [state,setState]=useState("CA");
  const [loading,setLoading]=useState(false);
  const [tickets,setTickets]=useState<Ticket[]|null>(null);
  const [channel,setChannel]=useState<"sms"|"email">("sms");
  const [value,setValue]=useState("");
  const [msg,setMsg]=useState<string|null>(null);

  async function onLookup(e:React.FormEvent){e.preventDefault();setMsg(null);setLoading(true);
    try{const r=await fetch("/api/core",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({op:"lookup_ticket",plate,state})});const j=await r.json();if(j.ok) setTickets(j.tickets); else setMsg("Lookup failed");}
    catch{setMsg("Network error");} finally{setLoading(false);} }

  async function onSubscribe(e:React.FormEvent){e.preventDefault();setMsg(null);
    try{const r=await fetch("/api/core",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({op:"subscribe",plate,state,channel,value})});const j=await r.json();setMsg(j.ok?(j.deduped?"Already subscribed":"Subscribed"):"Subscribe failed");}
    catch{setMsg("Network error");} }

  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">TicketPay</h1>
        <p className="mt-2 text-sm text-gray-c">Look up SF parking citations and subscribe to alerts.</p>

        <Card>
          <form onSubmit={onLookup} className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm">Plate</label>
              <Input placeholder="Plate (e.g., 7ABC123)" value={plate} onChange={e=>setPlate(e.target.value)} required />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm">State</label>
              <Input placeholder="State" value={state} onChange={e=>setState(e.target.value.toUpperCase())} required maxLength={3} className="uppercase" />
            </div>

            <div className="sm:col-span-6">
              <Button type="submit" disabled={loading}>{loading?"Searching…":"Search"}</Button>
            </div>
          </form>
        </Card>

        {msg && <div className="mt-4 rounded-xl border px-4 py-3 text-sm">{msg}</div>}

        {tickets && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-medium">Results</h2>
            {tickets.length===0 && <div className="rounded-xl border px-4 py-3 text-sm">No tickets found.</div>}
            {tickets.map(t=> (
              <Card key={t.id}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-c">{t.city}</div>
                  <div className="text-sm uppercase">{t.status}</div>
                </div>
                <div className="mt-1 text-xl font-semibold">{t.citation_number}</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-c">
                  <div>Amount: {formatCents(t.amount_cents)}</div>
                  <div>Issued: {new Date(t.issued_at).toLocaleString()}</div>
                  <div className="col-span-2">Violation: {t.violation||"—"}</div>
                  <div className="col-span-2">Location: {t.location||"—"}</div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <form onSubmit={onSubscribe} className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            <h2 className="sm:col-span-6 text-lg font-medium">Subscribe to alerts</h2>
            <div className="sm:col-span-2">
              <label className="block text-sm">Channel</label>
              <select className="h-12 w-full rounded-xl border px-4" value={channel} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChannel(e.target.value as 'sms'|'email')}>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm">Destination</label>
              <Input placeholder={channel==="sms"?"+14155551234":"you@example.com"} value={value} onChange={e=>setValue(e.target.value)} required />
            </div>

            <div className="sm:col-span-6">
              <Button type="submit">Subscribe</Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
