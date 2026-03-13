/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#14B8A6',
        'primary-dark': '#0F766E',
        'app-bg': '#F3F4F6',
        card: '#FFFFFF',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        'text-primary': '#0F172A',
        'text-secondary': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        card: '16px',
      },
      fontSize: {
        heading: ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        subheading: ['18px', { lineHeight: '1.35', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.5' }],
        small: ['12px', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [],
};
