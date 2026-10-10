/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#121212',
          800: '#1e1e1e',
          700: '#2d2d2d',
        },
        brand: {
          DEFAULT: '#ff9d00',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#ff9d00',
          600: '#ea8c00',
          700: '#c67200',
          800: '#9d5600',
          900: '#783f00',
          950: '#421f00',
        }
      }
    },
  },
  plugins: [],
}
