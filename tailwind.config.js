/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        headline: ['"Amiri"', 'serif'],
      },
    },
  },
  plugins: [],
};
