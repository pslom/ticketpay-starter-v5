'use client';
import { useState } from 'react';
import Link from 'next/link';
import StateSelect from '@/components/StateSelect';
import PhoneField from '@/components/PhoneField';
import { ExampleTiles } from '@/components/ExampleTiles';

export default function NewHome() {
  const [step, setStep] = useState<1|2>(1);
  const [state, setState] = useState('CA');
  const [plate, setPlate] = useState('');
  const [channel, setChannel] = useState<'sms'|'email'>('sms');
  const [contact, setContact] = useState('');

  const plateErr = plate && (plate.replace(/[^A-Z0-9]/g,'').length < 2 || plate.length > 8);

  return (
    <div className="aurora-bg min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-6 md:grid-cols-2">
        <div className="card p-6 md:p-10">
          <div className="kicker mb-4">SF Bay Area • Deadline protection</div>
          <h1 className="hero-h1">Never pay a late fee <span className="text-emerald-700">ever again</span></h1>
          <p className="sub mt-4">SF ticket alerts by SMS or email. We remind you before fees hit.</p>

          <div className="mt-8 h-2 w-full rounded-full bg-neutral-200">
            <div className="h-2 rounded-full bg-emerald-500" style={{width: step===1?'35%':'100%'}}/>
          </div>

          {step===1 && (
            <div className="mt-6 grid gap-4 md:grid-cols-[120px,1fr]">
              <div>
                <label htmlFor="state" className="meta mb-2 block">State</label>
                <StateSelect id="state" value={state} onChange={setState}/>
              </div>
              <div>
                <label htmlFor="plate" className="meta mb-2 block">Plate</label>
                <input id="plate" className="input uppercase" maxLength={8} value={plate}
                  onChange={(e)=>setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))}
                  placeholder="7ABC123" />
                {plateErr && <p className="mt-2 text-sm text-red-600">Enter 2–8 letters/numbers.</p>}
              </div>
              <div className="mt-2 flex gap-3">
                <button className="btn-primary" onClick={()=>!plateErr && plate && setStep(2)}>Next</button>
                <Link href="/l/pay" className="btn-secondary">Pay at SFMTA</Link>
              </div>
              <div className="col-span-full mt-2 flex flex-wrap gap-3">
                <div className="pill bg-neutral-100 text-neutral-700">Secure</div>
                <div className="pill bg-neutral-100 text-neutral-700">Smart reminders</div>
                <div className="pill bg-neutral-100 text-neutral-700">Cancel anytime</div>
              </div>
              <p className="meta col-span-full">US plates welcome. Alerts apply to SFMTA tickets only.</p>
            </div>
          )}

          {step===2 && (
            <div className="mt-6 space-y-4">
              <div className="pill bg-neutral-100 text-neutral-700 inline-flex">{state} · {plate}</div>
              <div className="inline-flex rounded-xl bg-neutral-100 p-1">
                <button onClick={()=>setChannel('sms')} className={`h-10 rounded-lg px-3 ${channel==='sms'?'bg-white shadow':''}`}>SMS</button>
                <button onClick={()=>setChannel('email')} className={`h-10 rounded-lg px-3 ${channel==='email'?'bg-white shadow':''}`}>Email</button>
              </div>
              <div>
                <label className="meta mb-2 block">{channel==='sms'?'Phone':'Email'}</label>
                {channel==='sms' ? (
                  <PhoneField value={contact} onChange={setContact}/>
                ) : (
                  <input className="input" inputMode="email" placeholder="name@domain.com" value={contact} onChange={(e)=>setContact(e.target.value)} />
                )}
                <p className="meta mt-2">Message & data rates may apply. Text STOP to cancel, HELP for help.</p>
              </div>
              <div className="flex gap-3">
                <button className="btn-primary">Start {channel==='sms'?'SMS':'email'} alerts</button>
                <button className="btn-secondary" onClick={()=>setStep(1)}>Back</button>
              </div>
            </div>
          )}
        </div>

        <ExampleTiles/>
      </div>
    </div>
  );
}
