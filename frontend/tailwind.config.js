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
        "deep-purple-electric-indigo": "#5952A6",
        "deep-purple-light-purple": "#675A9A",
        "deep-purple-aqua-teal": "#467F99",
        "deep-purple-pink-flower": "#9E6CAE",
        "deep-purple-lemon-lime": "#9C9A84",
        "electric-indigo-light-purple": "#7B6FD8",
        "electric-indigo-aqua-teal": "#5A94D8",
        "electric-indigo-pink-flower": "#B282ED",
        "electric-indigo-lemon-lime": "#B0AFC2",
        "light-purple-aqua-teal": "#689CCC",
        "light-purple-pink-flower": "#C08AE2",
        "light-purple-lemon-lime": "#BEB7B7",
        "aqua-teal-pink-flower": "#9EAFE0",
        "aqua-teal-lemon-lime": "#9CDCB6",
        "pink-flower-lemon-lime": "#F4CACC",
      },
    },
  },
  plugins: [],
};
