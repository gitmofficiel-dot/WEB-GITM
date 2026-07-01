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
        gitm: {
          /* Moroccan Flag Palette & Dark Theme Focus */
          red: '#c1272d', // Moroccan Red
          green: '#006233', // Moroccan Green
          
          /* Dark backgrounds to avoid the "blinding white" issue */
          dark: '#0a0a0a', // Deep black background
          cardDark: '#141414', // Slightly lighter for cards
          borderDark: '#262626',
          
          /* For the "light" mode, we'll keep it very soft gray, not pure white */
          light: '#e5e7eb', // Soft gray
          cardLight: '#f3f4f6', 
          borderLight: '#d1d5db',

          textDark: '#f8fafc',
          textLight: '#111827',
          mutedDark: '#9ca3af',
          mutedLight: '#4b5563'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'Cairo', 'sans-serif'],
        heading: ['Outfit', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        '3d': '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 20px rgba(193, 39, 45, 0.1)',
        '3d-hover': '0 30px 60px -15px rgba(0,0,0,0.6), 0 0 30px rgba(0, 98, 51, 0.2)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
    },
  },
  plugins: [],
}
