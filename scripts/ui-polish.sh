#!/usr/bin/env bash
set -e

echo "🛠  TicketPay UI polish — applying patches..."

mkdir -p src/lib src/app src/components scripts

############################################
# 1) Global styles: cards, CTA, grid, glow
############################################
cat > src/app/globals.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ---- Soft grid watermark + page glows ---- */
@layer utilities {
  .bg-grid-soft {
    background-image:
      linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .bg-glow-top {
    background:
      radial-gradient(900px 520px at 50% -180px, rgba(16,185,129,0.12), transparent 60%);
  }
  .bg-glow-right {
    background:
      radial-gradient(900px 520px at 120% 20%, rgba(16,185,129,0.12), transparent 60%);
  }
  .bg-glow-left {
    background:
      radial-gradient(900px 520px at -20% 20%, rgba(16,185,129,0.12), transparent 60%);
  }

  /* Card tokens */
  .card-agency { @apply rounded-3xl bg-white p-8 border border-gray-100 shadow-2xl; }
  .elev-interactive { box-shadow: 0 14px 40px -18px rgba(16,185,129,0.45), 0 2px 10px rgba(0,0,0,0.06); }
  .elev-info        { box-shadow: 0 10px 28px -20px rgba(0,0,0,0.25); }

  /* CTA */
  .btn-primary {
    @apply h-14 rounded-2xl bg-emerald-600 text-white font-semibold transition-all;
    box-shadow: 0 12px 26px -14px rgba(16,185,129,0.55);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 18px 38px -16px rgba(16,185,129,0.6); }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    @apply h-12 rounded-xl border-2 border-gray-200 bg-white text-gray-800 font-semibold hover:bg-gray-50 transition-colors;
  }

  /* Motion */
  @keyframes scaleIn150 { from { transform: scale(0.98); opacity: 0 } to { transform: scale(1); opacity: 1 } }
  .animate-scale-in-150 { animation: scaleIn150 150ms ease-out both; }
}

/* Ensure focus visibility against white */
:where(button, a, input, select, textarea):focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Base typographic smoothing (kept light) */
body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }

/* Touch targets */
button, .btn-primary, .btn-secondary { min-height: 44px; }
EOF

############################################
# 2) Analytics wrapper
############################################
cat > src/lib/analytics.ts <<'EOF'
type EventName =
  | 'home_step1_valid_plate'
  | 'home_step2_view'
  | 'subscribe_submit'
  | 'subscribe_success'
  | 'manage_pause'
  | 'manage_delete'
  | 'manage_add_plate';

function maskContact(contact: string) {
  if (!contact) return '';
  if (contact.includes('@')) {
    const [n, d] = contact.split('@');
    return `${n?.slice(0,2)}***@${d}`;
  }
  // phone
  const digits = contact.replace(/\D/g, '');
  return digits.length >= 4 ? `***${digits.slice(-4)}` : '***';
}

export function track(name: EventName, payload: Record<string, unknown> = {}) {
  try {
    const body = { name, ts: Date.now(), ...payload };
    // swap this for your analytics SDK later:
    if (process.env.NODE_ENV !== 'production') console.log('track', body);
    // TODO: send to /api/track if needed
  } catch (_) {}
}

export { maskContact };
EOF

############################################
# 3) Home page — spacing, a11y, SMS nudge hook in Step 2
############################################
cat > src/app/page.tsx <<'EOF'
...existing code from your message...
EOF

############################################
# 4) Results page — uppercase plate + SMS add link, card motion
############################################
cat > src/app/results/page.tsx <<'EOF'
...existing code from your message...
EOF

############################################
# 5) Manage page — denser rows, primary CTA, confirm delete, empty state
############################################
cat > src/app/manage/page.tsx <<'EOF'
...existing code from your message...
EOF

############################################
# 6) Consent page — one-liner add
############################################
cat > src/app/consent/page.tsx <<'EOF'
...existing code from your message...
EOF

############################################
# 7) Layout metadataBase to silence warning
############################################
cat > src/app/layout.tsx <<'EOF'
...existing code from your message...
EOF

echo "✅ UI polish applied."
echo "➡️  Now run: npm run clean && npm run dev"
