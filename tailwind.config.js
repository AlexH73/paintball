/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        camouflage: {
          100: "#f0f0e6",
          200: "#d8d8c8",
          300: "#c0c0aa",
          400: "#a8a88c",
          500: "#90906e",
          600: "#787850",
          700: "#606032",
          800: "#484814",
          900: "#303000",
        },
      },
    },
  },
  plugins: [],
};
