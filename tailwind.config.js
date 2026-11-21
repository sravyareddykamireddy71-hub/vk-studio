/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#0C0D0E',
          surface: '#141618',
          card: '#1A1D20',
          border: '#282C30',
          hover: '#22262A',
          muted: '#8E959E',
          text: '#F3F4F6',
          subtext: '#9CA3AF',
        },
        amber: {
          accent: '#D97706',
          light: '#F59E0B',
          glow: 'rgba(217, 119, 6, 0.15)',
        },
        brand: {
          dark: '#0A0A0B',
          charcoal: '#18181B',
          gold: '#C5A880',
          sand: '#E6E4DF',
          paper: '#F8F7F4',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(0, 0, 0, 0.4), 0 1px 4px -1px rgba(0, 0, 0, 0.2)',
        'premium': '0 12px 32px -8px rgba(0, 0, 0, 0.6), 0 4px 12px -2px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 25px -5px rgba(217, 119, 6, 0.25)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
