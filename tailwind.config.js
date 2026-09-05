/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        brand: {
          teal: '#0d9488',
          tealDark: '#0f766e',
          tealLight: '#ccfbf1',
          cyan: '#0284c7',
          cyanLight: '#e0f2fe',
        },
        medical: {
          normal: '#059669',
          normalBg: '#ecfdf5',
          normalBorder: '#a7f3d0',
          high: '#d97706',
          highBg: '#fffbeb',
          highBorder: '#fde68a',
          criticalHigh: '#dc2626',
          criticalHighBg: '#fef2f2',
          criticalHighBorder: '#fecaca',
          low: '#4f46e5',
          lowBg: '#eef2ff',
          lowBorder: '#c7d2fe',
          unknown: '#64748b',
          unknownBg: '#f8fafc',
          unknownBorder: '#e2e8f0',
          review: '#7c3aed',
          reviewBg: '#f5f3ff',
          reviewBorder: '#ddd6fe',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
