const colors = require("tailwindcss/colors")

module.exports = {
  content: [
    "./src/**/*{js,jsx,ts,tsx}"
  ],
  important: "#root",
  mode: "jit",
  dark: "class",
  blue: "class",
  light: "class",
  theme: {
    
    extend: {
      colors: {
        primary: {
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },

        "text-col": "var(--text-col)",

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
