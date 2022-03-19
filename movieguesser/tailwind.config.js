const colors = require("tailwindcss/colors")

module.exports = {
  content: [
    "./src/**/*{js,jsx,ts,tsx}"
  ],
  theme: {
    
    extend: {
      colors: {
        dark: {
          600: colors.slate["600"],
          700: colors.slate["700"],
          800: colors.slate["800"],
          900: colors.slate["900"],
        },

        light: {

        },

        clue: {
          gray: colors.slate["400"],
          yellow: colors.yellow["400"],
          green: colors.green["400"],
        }
      },
    },
  },
  plugins: [],
}
