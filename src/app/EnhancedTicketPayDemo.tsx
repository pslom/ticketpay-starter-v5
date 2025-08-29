'use client';
import { subscribeOnce } from '@/lib/subscribe';
import PhoneInputPretty from '@/components/PhoneInputPretty';
import StateDropdown from '@/components/StateDropdown';
import React, { useState } from 'react';

export default function EnhancedTicketPayDemo() {
  const [plate, setPlate] = useState('');
  const [stateVal, setStateVal] = useState('CA');
  const [channel, setChannel] = useState<'sms' | 'email'>('sms');
  const [contactValue, setContactValue] = useState('');
  const [plateError, setPlateError] = useState('');

  function handlePlateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setPlate(value);
    if (value.length < 2 || value.length > 8) setPlateError('Enter 2–8 characters');
    else setPlateError('');
  }

  async function handleSearch() { return; }
  async function handleSubscribe(){
  setDup(false);
  if(!plate || plateError) return;
  if(!contactValue) return;
  const resp = await subscribeOnce({ state: stateVal, plate, channel, contact: contactValue, alsoEmail: wantEmailToo, email: secondaryEmail });
  if(!resp.ok){ console.warn('subscribe failed', resp); return; }
  if(resp.duplicate){ setDup(true); return; }
  // success path continues as-is
}


  return (
    <div className="min-h-screen bg-aurora p-6 md:p-10">
      <div className="mx-auto max-w-[960px] space-y-8">
        <div className="card p-8 space-y-6">
          <h1 className="text-2xl font-bold">TicketPay Demo</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-600">State</label>
<StateDropdown value={stateVal} onChange={setStateVal} />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm text-neutral-600">Plate</label>
              <input
                className="input px-3"
                value={plate}
                onChange={handlePlateChange}
              />
              {plateError ? <p className="text-xs text-red-600">{plateError}</p> : null}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="inline-flex rounded-xl p-1 bg-neutral-100">
              <button
                className={`h-10 px-3 rounded-lg ${channel==='sms'?'bg-emerald-100 text-emerald-800':'text-neutral-800'}`}
                onClick={()=>setChannel('sms')}
              >
                SMS
              </button>
              <button
                className={`h-10 px-3 rounded-lg ${channel==='email'?'bg-emerald-100 text-emerald-800':'text-neutral-800'}`}
                onClick={()=>setChannel('email')}
              >
                Email
              </button>
            </div>
<label className="ml-3 inline-flex items-center gap-2 text-sm">
  <input type="checkbox" checked={wantEmailToo} onChange={(e)=>setWantEmailToo(e.target.checked)} />
  <span>Also send to email</span>
</label>
{wantEmailToo && channel==='sms' ? (
  <input className="input px-3 mt-2 max-w-sm" placeholder="name@domain.com" value={secondaryEmail} onChange={(e)=>setSecondaryEmail(e.target.value)} />
) : null}


            {channel==='sms' ? (
  <PhoneInputPretty value={contactValue} onChange={setContactValue} />
) : (
  <input className="input px-3 flex-1 max-w-sm" placeholder="name@domain.com" value={contactValue} onChange={(e)=>setContactValue(e.target.value)} />
)}
<div className="flex gap-3">
              <button className="btn-primary" onClick={handleSearch}>Check</button>
              <button className="btn-primary" onClick={handleSubscribe}>Subscribe</button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-500">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="mb-1 font-semibold text-neutral-900">New ticket: 7ABC123</p>
                <p className="mb-2 text-sm text-neutral-800">$73 • Expired meter • Mission &amp; 3rd</p>
                <div className="flex items-center gap-4 text-xs text-neutral-700">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Posted 12 min ago
                  </span>
                  <span className="font-medium text-amber-700">Due in 21 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
