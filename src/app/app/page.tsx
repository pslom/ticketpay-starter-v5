// src/app/app/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import RecentTickets from '@/components/dashboard/RecentTickets';

type Plate = {
  id: string;
  license_plate: string;
  state: string;
  nickname?: string | null;
  is_paused?: boolean;
  active?: boolean;
  created_date?: string;
};

type Ticket = {
  id: string;
  ticket_number: string;
  license_plate: string;
  amount: number | null;
  issue_date: string | null;
  due_date: string | null;
  status: 'active' | 'paid' | 'dismissed' | 'voided';
};

type Step = 'welcome' | 'addPlate' | 'verify' | 'success' | 'dashboard';

const plateSchema = z.object({
  license: z.string().min(2).max(10),
  state: z.string().length(2),
  nickname: z.string().max(32).optional(),
});

const US_STATES = ['CA','AZ','NV','OR','WA','NY','TX','FL','IL','PA','CO','UT','MA','NJ','DC','GA','NC','VA'];

const fade: any = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

export default function AppPage() {
  const [step, setStep] = useState<Step>('welcome');
  const [loading, setLoading] = useState(false);
  const [plates, setPlates] = useState<Plate[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // In a real app, userId comes from your auth session.
  useEffect(() => {
    const id = window.localStorage.getItem('demo_user_id') ?? crypto.randomUUID();
    window.localStorage.setItem('demo_user_id', id);
    setUserId(id);
    // Preload dashboard if user has plates.
    refresh();
  }, []);

  const activeTickets = useMemo(
    () => tickets.filter(t => t.status === 'active'),
    [tickets]
  );

  const recentTickets = useMemo(() => {
    return (tickets ?? []).map((t) => ({
      id: t.id,
      status: (t.status as any) ?? 'active',
      citation_number: (t.ticket_number as any) ?? (t.citation_number as any) ?? String(t.id),
      citation_issued_datetime: (t.issue_date as any) ?? (t.citation_issued_datetime as any) ?? null,
      citation_location: (t.citation_location as any) ?? null,
      analysis_neighborhood: (t.analysis_neighborhood as any) ?? null,
      violation_desc: (t.violation_desc as any) ?? null,
      fine_amount: (t.amount as any) ?? (t.fine_amount as any) ?? null,
      vehicle_plate: (t.license_plate as any) ?? (t.vehicle_plate as any) ?? '',
      due_date: (t.due_date as any) ?? null,
    }));
  }, [tickets]);

  async function refresh() {
    try {
      const [p, t] = await Promise.all([
        fetch('/api/plates', { method: 'POST', body: JSON.stringify({ action: 'list', userId }) }).then(r => r.json()),
        fetch('/api/tickets', { method: 'POST', body: JSON.stringify({ action: 'list', userId }) }).then(r => r.json()),
      ]);
      setPlates(p ?? []);
      setTickets(t ?? []);
      if ((p ?? []).length > 0) setStep('dashboard');
    } catch {}
  }

  async function addPlate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const license = String(form.get('license') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const state = String(form.get('state') || '');
    const nickname = String(form.get('nickname') || '');
    const parsed = plateSchema.safeParse({ license, state, nickname });
    if (!parsed.success || !userId) return;

    setLoading(true);
    try {
      const res = await fetch('/api/plates', {
        method: 'POST',
        body: JSON.stringify({ action: 'create', userId, license_plate: license, state, nickname }),
      });
      if (res.ok) {
        await refresh();
        setStep('verify');
      }
    } finally {
      setLoading(false);
    }
  }

  async function sendOtp() {
    if (!phone) return;
    setLoading(true);
    try {
      await fetch('/api/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!phone || otp.length !== 6 || !userId) return;
    setLoading(true);
    try {
      const ok = await fetch('/api/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, code: otp, userId }),
      }).then(r => r.ok);
      if (ok) setStep('success');
    } finally {
      setLoading(false);
    }
  }

  async function removePlate(id: string) {
    if (!confirm('Remove this plate from monitoring?')) return;
    await fetch('/api/plates', { method: 'POST', body: JSON.stringify({ action: 'deactivate', id }) });
    await refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.section key="welcome" {...fade} className="bg-white rounded-xl shadow p-6">
            <h1 className="text-2xl font-bold text-slate-900">Parking ticket alerts for San Francisco</h1>
            <p className="text-slate-600 mt-2">
              We check the city’s feed daily. Data can lag. We’ll text you when we find a new ticket.
            </p>
            <button
              onClick={() => setStep('addPlate')}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Get started
            </button>
          </motion.section>
        )}

        {step === 'addPlate' && (
          <motion.section key="addPlate" {...fade} className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900">Add plate</h2>
            <form onSubmit={addPlate} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-slate-700">License plate</label>
                <input name="license" placeholder="ABC1234"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono"
                  required />
              </div>
              <div>
                <label className="block text-sm text-slate-700">State</label>
                <select name="state" defaultValue="CA"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2" required>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700">Nickname (optional)</label>
                <input name="nickname" placeholder="My Honda" className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('welcome')}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving…' : 'Continue'}
                </button>
              </div>
            </form>
          </motion.section>
        )}

        {step === 'verify' && (
          <motion.section key="verify" {...fade} className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900">Verify your phone</h2>
            <p className="text-sm text-slate-600 mt-1">We’ll send alerts for new tickets and reminders 5 days and 48 hours before late fees.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm text-slate-700">Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="(415) 555-1234"
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
              </div>
              <div className="flex gap-2">
                <button onClick={sendOtp}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={!phone || loading}>
                  {loading ? 'Sending…' : 'Send code'}
                </button>
                <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                  placeholder="123456"
                  className="flex-1 rounded border border-slate-300 px-3 py-2 font-mono tracking-widest" />
                <button onClick={verifyOtp}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                  disabled={otp.length !== 6 || loading}>
                  Verify
                </button>
              </div>
              <p className="text-xs text-slate-500">Msg & data rates may apply. Reply STOP to opt out.</p>
            </div>
          </motion.section>
        )}

        {step === 'success' && (
          <motion.section key="success" {...fade} className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-slate-900">You’re all set</h2>
            <p className="text-slate-600 mt-2">We’ll start checking your plate during the next daily update.</p>
            <button onClick={() => setStep('dashboard')}
              className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Go to dashboard
            </button>
          </motion.section>
        )}

        {step === 'dashboard' && (
          <motion.section key="dashboard" {...fade} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
              <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                onClick={() => setStep('addPlate')}>
                Add plate
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-700">My Plates</h3>
                <div className="mt-2 space-y-2">
                  {plates.length === 0 && <div className="text-slate-500 text-sm">No plates yet.</div>}
                  {plates.map(p => (
                    <div key={p.id} className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold">{p.license_plate}</span>
                        <span className="text-xs text-slate-500">{p.state}</span>
                        {p.nickname && <span className="text-xs text-slate-500">• {p.nickname}</span>}
                      </div>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => removePlate(p.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-700">Tickets</h3>
                  <div className="mt-2">
                    <RecentTickets tickets={recentTickets as any} />
                  </div>
              </div>

              {activeTickets.length > 0 && (
                <div className="rounded bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                  Reminder windows: we’ll text 5 days and 48 hours before late fee (based on due date unless the city publishes a separate date).
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
