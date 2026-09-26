/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: "#eef5f5",
          100: "#d7e8e8",
          200: "#b0d1d1",
          300: "#7fb4b4",
          400: "#4d9494",
          500: "#2f7877",
          600: "#235e5e",
          700: "#1c4a4a",
          800: "#173c3c",
          900: "#0f2828",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
