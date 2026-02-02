/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A', // Slate 900 (Deep Navy)
        secondary: '#C5A059', // Muted Gold
        accent: '#F9FAFB', // Cool Gray 50 (Off-white)
        'primary-hover': '#1E293B',
        'secondary-hover': '#B08D45',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
