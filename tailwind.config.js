/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        ticker:       'ticker 40s linear infinite',
        'fade-up':    'fadeUp 0.5s ease-out',
        'spin-slow':  'spin 20s linear infinite',
        'spin-med':   'spin 14s linear infinite reverse',
        'spin-fast':  'spin 8s linear infinite',
        'orbit-1':    'orbit1 4s linear infinite',
        'orbit-2':    'orbit2 6s linear infinite',
        'orbit-3':    'orbit3 9s linear infinite',
        'heartbeat':  'heartbeat 1.8s ease-in-out infinite',
        'sparkle':    'sparkle 2.4s ease-in-out infinite',
        'sparkle-2':  'sparkle 1.9s ease-in-out infinite 0.5s',
        'sparkle-3':  'sparkle 2.8s ease-in-out infinite 1s',
        'sparkle-4':  'sparkle 2.1s ease-in-out infinite 0.3s',
        'sparkle-5':  'sparkle 3s ease-in-out infinite 0.8s',
        'sparkle-6':  'sparkle 2.6s ease-in-out infinite 1.4s',
        'float-up-1': 'floatUp 3s ease-in-out infinite',
        'float-up-2': 'floatUp 3.5s ease-in-out infinite 0.4s',
        'float-up-3': 'floatUp 2.8s ease-in-out infinite 0.8s',
        'fade-in-up': 'fadeInUp 0.7s ease-out both',
        'fade-in-up-delay': 'fadeInUp 0.7s ease-out 0.2s both',
        'fade-in-up-delay2': 'fadeInUp 0.7s ease-out 0.4s both',
        'scale-in':   'scaleIn 0.6s ease-out both',
      },
      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        heartbeat: {
          '0%,100%': { transform: 'scale(1)' },
          '15%':     { transform: 'scale(1.25)' },
          '30%':     { transform: 'scale(1.08)' },
          '45%':     { transform: 'scale(1.18)' },
          '60%':     { transform: 'scale(1)' },
        },
        sparkle: {
          '0%,100%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%':     { transform: 'scale(1) rotate(180deg)', opacity: '1' },
        },
        floatUp: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
        orbit1: {
          from: { transform: 'rotate(0deg) translateX(72px) rotate(0deg)' },
          to:   { transform: 'rotate(360deg) translateX(72px) rotate(-360deg)' },
        },
        orbit2: {
          from: { transform: 'rotate(120deg) translateX(56px) rotate(-120deg)' },
          to:   { transform: 'rotate(480deg) translateX(56px) rotate(-480deg)' },
        },
        orbit3: {
          from: { transform: 'rotate(240deg) translateX(88px) rotate(-240deg)' },
          to:   { transform: 'rotate(600deg) translateX(88px) rotate(-600deg)' },
        },
      },
    },
  },
  plugins: [],
};
