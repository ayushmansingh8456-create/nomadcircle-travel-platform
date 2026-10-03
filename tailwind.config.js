/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Obsidian black canvas
        obsidian: {
          950: '#0B0C10',
          900: '#121214',
          800: '#1A1C20',
          700: '#1F2833',
          600: '#2B3440',
          500: '#3A4550',
        },
        // Slate-black card containers (layered depth)
        slate: {
          950: '#1F2833',
          900: '#252D38',
          800: '#2B3440',
          700: '#34404D',
          600: '#3D4A58',
          500: '#4A5868',
        },
        // Diamond white text
        diamond: {
          50: '#FFFFFF',
          100: '#F5F5F7',
          200: '#E8E8EC',
          300: '#D1D1D8',
          400: '#A0A0AA',
          500: '#7A7A85',
          600: '#5A5A65',
        },
        // Turquoise neon accent
        turquoise: {
          50: '#E6FFFE',
          100: '#B0FFF8',
          200: '#5EFFF5',
          300: '#2BF0E8',
          400: '#00D9D0',
          500: '#00B8B0',
          600: '#009A92',
          700: '#007A72',
        },
        // Electric coral accent
        coral: {
          300: '#FFB4A0',
          400: '#FF8E72',
          500: '#FF6B4A',
          600: '#E85A3F',
        },
        // Warm gold accent
        gold: {
          300: '#FFE5A0',
          400: '#FFD060',
          500: '#F5B820',
          600: '#D89A00',
        },
        // Mint accent (kept)
        mint: {
          400: '#5EE0B0',
          500: '#3DCCA0',
          600: '#2AB080',
        },
        // Legacy aliases mapped to dark theme for backward compat
        sand: {
          50: '#1F2833',
          100: '#252D38',
          200: '#2B3440',
          300: '#3A4550',
          400: '#4A5868',
          500: '#5A6573',
          600: '#7A8590',
        },
        ocean: {
          50: '#0C2A2E',
          100: '#0F3A40',
          200: '#1A5A60',
          300: '#00D9D0',
          400: '#00BFBA',
          500: '#00B8B0',
          600: '#009A92',
          700: '#007A72',
          800: '#005A52',
          900: '#003A35',
        },
        sky: {
          50: '#0C1A2E',
          100: '#0F2A40',
          200: '#1A3A50',
          300: '#2B4A60',
          400: '#3D5A70',
          500: '#4A6A80',
        },
        ink: {
          700: '#2B3440',
          800: '#1A1C20',
          900: '#0B0C10',
        },
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.75rem',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.3)',
        'soft-md': '0 8px 30px rgba(0, 0, 0, 0.4)',
        'soft-lg': '0 16px 48px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 24px rgba(0, 217, 208, 0.15)',
        'glow-turquoise': '0 0 20px rgba(0, 217, 208, 0.25), 0 0 40px rgba(0, 217, 208, 0.1)',
        'glow-coral': '0 0 20px rgba(255, 107, 74, 0.25), 0 0 40px rgba(255, 107, 74, 0.1)',
        'glow-gold': '0 0 20px rgba(245, 184, 32, 0.25), 0 0 40px rgba(245, 184, 32, 0.1)',
        'glow-md': '0 0 30px rgba(0, 217, 208, 0.2), 0 0 60px rgba(0, 217, 208, 0.08)',
        'glow-lg': '0 0 40px rgba(0, 217, 208, 0.3), 0 0 80px rgba(0, 217, 208, 0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'pulse-ring': 'pulseRing 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'ping-slow': 'pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.2', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pingSlow: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 217, 208, 0.15), 0 0 40px rgba(0, 217, 208, 0.05)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 217, 208, 0.3), 0 0 60px rgba(0, 217, 208, 0.12)' },
        },
      },
    },
  },
  plugins: [],
};
