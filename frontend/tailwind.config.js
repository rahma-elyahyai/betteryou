// tailwind.config.js
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Remplace lime par ta couleur (on garde les autres couleurs)
        lime: {
          ...colors.lime,
          400: "#D6F93D",
          500: "#C7E834",
        },
      },
    },
  },
  plugins: [],
};

