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
        cyber: {
          bg: '#050811',
          card: 'rgba(11, 19, 43, 0.7)',
          border: 'rgba(58, 80, 107, 0.3)',
          borderGlow: 'rgba(0, 229, 255, 0.3)',
          primary: '#0B132B',
          secondary: '#3A506B',
          accentCyan: '#00E5FF',
          accentGreen: '#00FF87',
          emerald: '#00FF87',
          cyan: '#00E5FF',
          indigo: '#6366f1',
          text: '#F0F6F6',
          muted: '#8A99AD',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        sans: ['Outfit', 'Cairo', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 20px rgba(0, 255, 135, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 229, 255, 0.3)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-industrial': '0 4px 30px rgba(11, 19, 43, 0.4)',
        'card-3d': '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(0,229,255,0.05)',
        'card-hover': '0 30px 80px rgba(0,0,0,0.4), 0 0 60px rgba(0,229,255,0.1)',
        'glass': '0 8px 32px rgba(0,0,0,0.12)',
        'glass-dark': '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin 15s linear infinite reverse',
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee 30s linear infinite reverse',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'tilt-3d': 'tilt3d 10s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'orbit-reverse': 'orbit 25s linear infinite reverse',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'typing': 'typing 1.5s steps(20) infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        tilt3d: {
          '0%, 100%': { transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)' },
          '25%': { transform: 'perspective(1000px) rotateY(2deg) rotateX(1deg)' },
          '50%': { transform: 'perspective(1000px) rotateY(-2deg) rotateX(-1deg)' },
          '75%': { transform: 'perspective(1000px) rotateY(1deg) rotateX(2deg)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(80px) rotate(-360deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,229,255,0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(0,229,255,0.5)' },
        },
        typing: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
    },
  },
  plugins: [],
}
