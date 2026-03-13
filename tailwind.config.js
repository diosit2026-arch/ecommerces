/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8b5cf6",
        secondary: "#ec4899",
        background: "#0f172a",
        surface: "#1e293b",
        textPrimary: "#f8fafc",
        textSecondary: "#94a3b8",
        accent: "#10b981",
      },
    },
  },
  plugins: [],
}
