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
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        bg: 'var(--bg)',
        text: 'var(--text)',
        glass: 'var(--glass)',
        glassBorder: 'var(--glass-border)',
        headglass: 'var(--head-glass)'
      },
      fontFamily: {
        heading: ['var(--heading-font)', 'serif'],
        body: ['var(--body-font)', 'sans-serif'],
        shloka: ['var(--shloka-font)', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-x': 'bounce-x 1s infinite',
        'pulse-green': 'pulse-green 2s infinite',
        'fade-in': 'scaleFadeIn 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'zoom-in': 'zoomIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(5px)' },
        },
        'pulse-green': {
          '0%': { boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(74, 222, 128, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(74, 222, 128, 0)' },
        },
        scaleFadeIn: {
          'from': { opacity: '0', transform: 'scale(0.98)' },
          'to': { opacity: '1', transform: 'scale(1)' }
        },
        zoomIn: {
          'from': { transform: 'scale(0.5)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}