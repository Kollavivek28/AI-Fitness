/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6C63FF',
          secondary: '#00BFA6',
          accent: '#FF6584',
        },
        surface: {
          light: '#f6f7fb',
          dark: '#101828',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(15, 23, 42, 0.25)',
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(0deg, transparent 24%, rgba(99,102,241,0.1) 25%, rgba(99,102,241,0.1) 26%, transparent 27%, transparent 74%, rgba(99,102,241,0.1) 75%, rgba(99,102,241,0.1) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(99,102,241,0.1) 25%, rgba(99,102,241,0.1) 26%, transparent 27%, transparent 74%, rgba(99,102,241,0.1) 75%, rgba(99,102,241,0.1) 76%, transparent 77%)',
        'grid-dark':
          'linear-gradient(0deg, transparent 24%, rgba(15,23,42,0.3) 25%, rgba(15,23,42,0.3) 26%, transparent 27%, transparent 74%, rgba(15,23,42,0.3) 75%, rgba(15,23,42,0.3) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(15,23,42,0.3) 25%, rgba(15,23,42,0.3) 26%, transparent 27%, transparent 74%, rgba(15,23,42,0.3) 75%, rgba(15,23,42,0.3) 76%, transparent 77%)',
      },
    },
  },
  plugins: [],
};

