/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "landing-page": "url('src//assets/book-cover-bg.png')",
      },
      fontFamily: {
        poppins: ["Poppins", ...defaultTheme.fontFamily.sans],
        "roboto-mono": ["Roboto Mono", ...defaultTheme.fontFamily.mono],
        "roboto-serif": ["Roboto Serif", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        "deep-purple": "#453C67",
        "electric-indigo": "#6D67E4",
        "light-purple": "#8977CD",
        "aqua-teal": "#46C2CB",
        "pink-flower": "#F79CF6",
        "lemon-lime": "#F2F7A1",
      },
    },
  },
  plugins: [],
};
