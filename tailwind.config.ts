import type { Config } from 'tailwindcss';

export default {
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
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 6px 20px rgba(0,0,0,0.06)',
      },
      transitionDuration: {
        fast: '150ms',
        mid: '200ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
