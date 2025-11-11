/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#475569',
        accent: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        success: '#10b981',
        surface: '#ffffff',
        background: '#f8fafc'
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        '12': ['12px', '1.5'],
        '14': ['14px', '1.5'],
        '16': ['16px', '1.5'],
        '20': ['20px', '1.4'],
        '24': ['24px', '1.3'],
        '32': ['32px', '1.2']
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.1)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.15)',
        'lifted': '0 4px 12px rgba(0,0,0,0.1)'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      }
    },
  },
  plugins: [],
}