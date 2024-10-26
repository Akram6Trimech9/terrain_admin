/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#3c3c3c",
        secondary:"#fab51f",
        grey:" #e4e4e4",

        secondary_dark:"#E1A21B"
      }
    },
  },
  plugins: [],
}