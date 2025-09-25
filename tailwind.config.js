module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "basmala","scene-header-1","scene-header-2","scene-header-3",
    "character","dialogue","continued-dialogue","action","transition","parenthetical"
  ],
  theme: {
    extend: {
      fontFamily: { amiri: ["Amiri","serif"] },
    },
  },
  plugins: [],
};