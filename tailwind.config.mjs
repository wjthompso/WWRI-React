/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ["IBM Plex Serif", "serif"],
      }
    }
  },
  plugins: []
}
