// src/components/AppShell.tsx
'use client';

import StatusStrip from './StatusStrip';
import AppHeader from './AppHeader';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <StatusStrip />
      <main className="mx-auto max-w-4xl px-4 py-6">
        {children}
      </main>
      <footer className="mx-auto max-w-4xl px-4 py-10 text-xs text-slate-500">
        <div>© {new Date().getFullYear()} TicketPay • SFMTA data is checked daily and may lag the city’s feed.</div>
        <div className="mt-2 flex gap-4">
          <a href="/terms" className="hover:text-slate-700">Terms</a>
          <a href="/privacy" className="hover:text-slate-700">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
