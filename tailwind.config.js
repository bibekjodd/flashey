/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
