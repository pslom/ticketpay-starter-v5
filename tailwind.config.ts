import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FFFFFF',
        text: '#0A0A0A',
        primary: '#000000',
        success: '#0EA566',
        warn: '#F59E0B',
        error: '#DC2626',
        grayA: '#F5F5F5',
        grayB: '#E5E7EB',
        grayC: '#9CA3AF',
        tp: {
          green: '#0F5A37',      // primary
          greenDark: '#0B472C',  // gradient end
          greenHue: '#106240',   // hover hue
          off: '#F7F5F2',        // warm card background
        },
      },
      borderRadius: {
        xl: '16px',
        '2xl': '1rem',
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 8px 24px rgba(16, 30, 25, 0.12)',
      },
      transitionDuration: {
        fast: '150ms',
        mid: '200ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
