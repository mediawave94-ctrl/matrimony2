/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#800000', // Maroon
        secondary: '#daa520', // Gold
        maroon: '#800000',
        gold: '#daa520',
        'brand-maroon': '#800000',
        'brand-gold': '#daa520',
        'brand-light-gold': '#fdfaf0',
        accent: '#fdfaf0',
        'primary-hover': '#660000',
        'secondary-hover': '#b8860b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
