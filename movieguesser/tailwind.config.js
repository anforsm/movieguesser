const colors = require("tailwindcss/colors")

module.exports = {
  content: [
    "./src/**/*{js,jsx,ts,tsx}"
  ],
  mode: "jit",
  dark: "class",
  blue: "class",
  light: "class",
  theme: {
    fontFamily: {
        "logo-font": ["Koulen", "Garamond"]
      },
    extend: {
  
      colors: {
        primary: {
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },

        "text-col": "var(--text-col)",
        "text-col-secondary": "var(--text-col-secondary)",

        clue: {
          gray: "var(--clue-gray)",
          yellow: "var(--clue-yellow)",
          green: "var(--clue-green)",
        }
      },
    },
  },
  plugins: [],
}
