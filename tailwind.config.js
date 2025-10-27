/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ▼▼▼ YOUR NEW COLOR THEME ▼▼▼
      colors: {
        [cite_start]'primary-blue': '#0A2768',     // From your PDF [cite: 536, 538, 540, 541]
        [cite_start]'accent-cyan': '#26BCCA',      // From your PDF [cite: 576, 577, 578, 579]
        'text-primary': '#1C2541',     // A dark blue for text
        'text-secondary': '#6c757d',   // Muted grey
        'background-color': '#f7f9fc', // A very light, clean background
        'border-color': '#dee2e6',
      },
      // ▲▲▲ YOUR NEW COLOR THEME ▲▲▲
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(11, 36, 71, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(11, 36, 71, 0.07) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}