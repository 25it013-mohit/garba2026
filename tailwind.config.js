/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        garbaGold: '#ffc107',
        garbaRani: '#e91e63',
        garbaSaffron: '#ff6d00',
        garbaTeal: '#00e5ff',
        garbaPurple: '#7c4dff'
      }
    },
  },
  plugins: [],
}
