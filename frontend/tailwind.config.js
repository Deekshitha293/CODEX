/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#14B8A6',
          dark: '#0F766E',
          light: '#F3F4F6'
        }
      },
      boxShadow: {
        soft: '0 8px 24px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        card: '16px'
      }
    }
  },
  plugins: []
};
