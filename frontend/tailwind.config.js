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
        navy: {
          950: '#05111F',
          900: '#072038',
          800: '#0B3558',
          700: '#104B7B',
          600: '#1662A0',
          500: '#1F7DC7',
          100: '#E3EDF5',
          50: '#F2F7FA',
        },
        aqua: {
          700: '#0B6891',
          600: '#0E7FA8',
          500: '#159BD7',
          400: '#3DB4E8',
          300: '#75CEF2',
          200: '#B0E4F9',
          100: '#E1F4FC',
          50: '#F0F9FD',
        },
        forest: {
          700: '#1B633F',
          600: '#238052',
          500: '#2FA36B',
          400: '#48BD83',
          300: '#7DD4A6',
          100: '#E6F6EE',
          50: '#F2FAF6',
        },
        surface: {
          base: '#F5FAFC',
          card: '#FFFFFF',
          dark: '#0B1523',
          darkcard: '#122033',
          darkborder: '#1E334D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(11, 53, 88, 0.06), 0 4px 6px -2px rgba(11, 53, 88, 0.04)',
        'soft-lg': '0 10px 25px -5px rgba(11, 53, 88, 0.08), 0 8px 10px -6px rgba(11, 53, 88, 0.04)',
        'glow-aqua': '0 0 20px rgba(21, 155, 215, 0.25)',
        'glow-green': '0 0 20px rgba(47, 163, 107, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
