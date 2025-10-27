/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0B2447',
        'accent-cyan': '#3DDAD7',
        'text-primary': '#1C2541',
        'text-secondary': '#6c757d',
        'background-color': '#f7f9fc',
        'border-color': '#dee2e6',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      // We can add the grid pattern here
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(11, 36, 71, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(11, 36, 71, 0.07) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}