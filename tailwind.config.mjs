/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#0A2768",
        "accent-cyan": "#26BCCA",
        "text-primary": "#1C2541",
        "text-secondary": "#6c757d",
        "background-color": "#f7f9fc",
        "border-color": "#dee2e6",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
