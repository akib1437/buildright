/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F5F2",
        ink: "#101C22",
        "ink-soft": "#3D4E57",
        amber: "#F2A71B",
        "amber-deep": "#D18E0A",
        blueprint: "#2E5E8C",
        line: "#DCE0DA",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
