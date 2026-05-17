/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Barlow', 'sans-serif'],
        display: ['Barlow Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
