/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0A2768',
        'primary-blue': '#124B8C',
        'accent-cyan': '#26BCCA',
        'cyan-bright': '#1CB7D1',
      },
      backgroundImage: {
        'qnect-gradient': 'linear-gradient(90deg, #0A2768 0%, #124B8C 35%, #1CB7D1 70%, #26BCCA 100%)',
      },
    },
  },
  plugins: [],
};
