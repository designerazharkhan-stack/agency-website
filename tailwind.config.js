import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2.5rem',
        xl: '3rem',
      },
      screens: {
        '2xl': '1360px',
      },
    },
    extend: {
      colors: {
        ink: {
          950: '#050505',
          900: '#08080A',
          850: '#0C0C0F',
          800: '#111114',
          750: '#16161A',
          700: '#1C1C21',
          600: '#26262D',
          500: '#3A3A44',
        },
        gold: {
          50: '#FBF7EC',
          100: '#F6EED6',
          200: '#EBDCB0',
          300: '#DFC884',
          400: '#D2B25C',
          500: '#C29A3C',
          600: '#A67C2A',
          700: '#846020',
          800: '#5E4517',
          900: '#3D2D10',
        },
        bone: {
          DEFAULT: '#F5F2EC',
          muted: '#B9B4A9',
          dim: '#8A857A',
        },
        plum: {
          900: '#150E1C',
          800: '#1E1428',
          700: '#2A1B38',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-xs': ['clamp(1.75rem, 3.2vw, 2.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(2.75rem, 7vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(3.25rem, 9.5vw, 7rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'display-xl': ['clamp(3.5rem, 12vw, 9rem)', { lineHeight: '0.94', letterSpacing: '-0.04em' }],
      },
      letterSpacing: {
        luxe: '0.28em',
        wide2: '0.18em',
        wide3: '0.12em',
      },
      backgroundImage: {
        'gold-sheen':
          'linear-gradient(115deg, #846020 0%, #C29A3C 18%, #F6EED6 38%, #DFC884 52%, #A67C2A 72%, #EBDCB0 100%)',
        'gold-soft':
          'linear-gradient(120deg, #A67C2A 0%, #D2B25C 45%, #F6EED6 70%, #C29A3C 100%)',
        'ink-radial': 'radial-gradient(120% 90% at 50% 0%, #16161A 0%, #08080A 55%, #050505 100%)',
        'hairline':
          'linear-gradient(90deg, transparent, rgba(194,154,60,0.55) 20%, rgba(246,238,214,0.75) 50%, rgba(194,154,60,0.55) 80%, transparent)',
      },
      boxShadow: {
        'gold-glow': '0 0 0 1px rgba(194,154,60,0.28), 0 24px 70px -28px rgba(194,154,60,0.42)',
        'gold-glow-sm': '0 0 0 1px rgba(194,154,60,0.22), 0 12px 36px -18px rgba(194,154,60,0.4)',
        'lift': '0 30px 80px -40px rgba(0,0,0,0.95)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.045)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
        swift: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 26px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1.14)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 1.1s ease forwards',
        shimmer: 'shimmer 7s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        'slow-zoom': 'slow-zoom 22s ease-in-out infinite alternate',
        'spin-slow': 'spin-slow 26s linear infinite',
        'pulse-gold': 'pulse-gold 3.4s ease-in-out infinite',
      },
      backgroundSize: {
        'gold-sheen': '220% 220%',
      },
    },
  },
  plugins: [forms({ strategy: 'class' })],
}
