/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app.html", // Include app.html for scanning Tailwind classes
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Scan all Vue, JS, TS files in the src folder
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        cosmic: {
          dark: '#0f172a',
          light: '#334155',
          accent: '#8b5cf6',
          glow: '#a78bfa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      boxShadow: {
        'cosmic': '0 0 15px rgba(139, 92, 246, 0.5)',
        'cosmic-lg': '0 0 25px rgba(139, 92, 246, 0.6)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}