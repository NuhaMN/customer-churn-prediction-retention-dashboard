/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#0B0D17', // deep navy/black
        sidebar: '#161A2B',
        glass: '#1A1A24',
        neonCyan: '#00F2FE',
        neonMagenta: '#FF00FF',
        neonGreen: '#00E676',
        textSilver: '#E0E0E0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 10px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [],
};
