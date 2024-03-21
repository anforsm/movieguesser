const colors = require("tailwindcss/colors")
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
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
};
export default config;
