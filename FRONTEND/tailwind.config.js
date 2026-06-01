/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0b0f19',
        darkCard: '#161e31',
        darkBorder: '#23304c',
        glassBg: 'rgba(22, 30, 49, 0.7)',
        accentPurple: '#818cf8',
        accentCyan: '#22d3ee',
        accentGreen: '#34d399',
      },
    },
  },
  plugins: [],
}
