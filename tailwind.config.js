/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tealPrimary: '#14B8A6',
        tealDark: '#0F766E',
        appBg: '#F3F4F6',
        textPrimary: '#0F172A',
        textSecondary: '#6B7280',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
};
