/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        soc: {
          bg: '#05070c',
          panel: '#0c0f17',
          card: '#111622',
          border: '#1f293d',
          hover: '#192233',
          red: {
            DEFAULT: '#dc2626',
            hover: '#b91c1c',
            glow: '#ef4444',
            dark: '#7f1d1d',
            dim: 'rgba(220, 38, 38, 0.15)'
          },
          accent: '#e11d48',
          text: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
            muted: '#64748b'
          }
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
      },
      boxShadow: {
        'glow-red': '0 0 15px -3px rgba(220, 38, 38, 0.45)',
        'glow-red-lg': '0 0 25px -2px rgba(220, 38, 38, 0.6)',
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.7)'
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
