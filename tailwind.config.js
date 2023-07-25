/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        mdp: "850px",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
