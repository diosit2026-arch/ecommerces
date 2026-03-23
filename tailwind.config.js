/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9cc63b",
        secondary: "#ef8455",
        background: "#f7f5ef",
        surface: "#ffffff",
        textPrimary: "#17313a",
        textSecondary: "#607a80",
        accent: "#2db9a3",
      },
    },
  },
  plugins: [],
}
