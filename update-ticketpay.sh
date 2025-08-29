#!/bin/bash

# TicketPay Complete Theme Update Script
# Run this from your project root: bash update-ticketpay.sh

echo "🚀 Starting TicketPay theme update..."

# 1. Update Tailwind Config
echo "📝 Updating tailwind.config.ts..."
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
EOF

# 2. Update Global CSS
echo "🎨 Updating globals.css..."
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* TicketPay Global Styles */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer utilities {
  .animate-in {
    animation: slideUp 0.3s ease-out;
  }
  
  .text-balance {
    text-wrap: balance;
  }
}

/* Custom animations */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    transparent 25%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
EOF

# 3. Create shared components
echo "🧩 Creating shared components..."

# Logo component
cat > src/components/Logo.tsx << 'EOF'
import { Shield } from 'lucide-react'

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <span className="font-bold text-xl sm:text-2xl text-neutral-900">TicketPay</span>
    </div>
  )
}
EOF

# Header component
cat > src/components/Header.tsx << 'EOF'
'use client'
import Logo from './Logo'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-6 sm:p-8">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <Link 
          href="/manage" 
          className="text-sm text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
        >
          Manage alerts
        </Link>
      </nav>
    </header>
  )
}
EOF

# Alert Examples component
cat > src/components/AlertExamples.tsx << 'EOF'
import { AlertCircle, Clock } from 'lucide-react'

export function TicketAlert() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-neutral-900 text-sm sm:text-base">
            SF Parking Ticket Alert
          </p>
          <p className="text-sm sm:text-base text-neutral-700 mt-1">
            Street cleaning violation • Mission District
          </p>
          <p className="text-sm sm:text-base text-neutral-700">
            Amount: $82 • Due: May 15 (21 days)
          </p>
          <a href="#" className="inline-flex items-center gap-1 mt-3 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700">
            Pay at SFMTA.com →
          </a>
        </div>
      </div>
    </div>
  )
}

export function ReminderAlert() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-neutral-900 text-sm sm:text-base">
            Quick heads up - ticket due soon
          </p>
          <p className="text-sm sm:text-base text-neutral-700 mt-1">
            Your parking ticket is due in 5 days
          </p>
          <p className="text-sm sm:text-base text-neutral-700">
            Amount: $82 • Pay by May 15 to avoid late fee
          </p>
          <a href="#" className="inline-flex items-center gap-1 mt-3 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700">
            Pay now at SFMTA.com →
          </a>
        </div>
      </div>
    </div>
  )
}
EOF

# Loading spinner component
cat > src/components/Spinner.tsx << 'EOF'
export default function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
EOF
