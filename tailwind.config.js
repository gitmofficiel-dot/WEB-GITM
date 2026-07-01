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
          /* Integrated Palette: Moroccan Flag + Tech Blue */
          red: '#c1272d', // Moroccan Red
          green: '#006233', // Moroccan Green
          blue: '#2563eb', // Tech Blue
          cyan: '#06b6d4', // Modern Tech Cyan
          
          /* Dark backgrounds for Dark Mode */
          dark: '#0a0a0a', 
          cardDark: '#141414', 
          borderDark: '#262626',
          
          /* Light backgrounds (Restoring pure white as base) */
          light: '#ffffff', // Restored pure white base
          cardLight: '#f9fafb', // Very subtle off-white for cards
          borderLight: '#e5e7eb',

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
        '3d': '0 20px 40px -10px rgba(0,0,0,0.2), 0 0 20px rgba(193, 39, 45, 0.05)',
        '3d-hover': '0 30px 60px -15px rgba(0,0,0,0.3), 0 0 30px rgba(0, 98, 51, 0.1)',
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
