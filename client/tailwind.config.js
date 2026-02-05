/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5a0001', // Deep Maroon
        secondary: '#d4af37', // Premium Gold
        accent: '#F9FAFB',
        'primary-hover': '#4a0000',
        'secondary-hover': '#c19b2e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
