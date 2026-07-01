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
          /* Primary Dark Blue - extracted from logo vibe */
          dark: '#020617', // Very deep blue-black for dark mode bg
          cardDark: '#0f172a', // Slightly lighter blue-black for dark mode cards
          borderDark: '#1e293b', 
          
          /* Primary Light */
          light: '#f8fafc', // Off-white for light mode bg
          cardLight: '#ffffff', // Pure white for light mode cards
          borderLight: '#e2e8f0',

          /* Accents */
          cyan: '#00E5FF',
          blue: '#3b82f6',
          teal: '#0ea5e9',
          
          textDark: '#f1f5f9',
          textLight: '#0f172a',
          mutedDark: '#94a3b8',
          mutedLight: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'Cairo', 'sans-serif'],
        heading: ['Outfit', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'hover': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
        'hover-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
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
