export default function TrustRow(){
  return (
    <div className="mt-4 flex flex-wrap items-center gap-6 text-slate-600">
      <span className="inline-flex items-center gap-2"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 6v6c0 5 3.8 9.4 8 10 4.2-.6 8-5 8-10V6l-8-4Zm0 16.4c-2.4-.5-4.8-3.2-4.8-6.1V8.5l4.8-2.4 4.8 2.4v3.8c0 2.9-2.4 5.6-4.8 6.1Z"/></svg>Secure</span>
      <span className="inline-flex items-center gap-2"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a1 1 0 0 1-1-1v-8.1L7.2 5.6a1 1 0 1 1 1.8-.9L12 10l3-5.3a1 1 0 1 1 1.8.9L13 12.9V21a1 1 0 0 1-1 1Z"/></svg>Smart reminders</span>
      <span className="inline-flex items-center gap-2"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 11h4v-2h-3V7h-2v6Z"/></svg>Cancel anytime</span>
    </div>
  )
}
