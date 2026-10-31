/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        growwGreen: "#00D09C",
        growwGreenText: "#00875A",
        growwGreenBg: "#E8F8F3",
        growwRed: "#EB5B3C",
        growwRedBg: "#FDF1EE",
        growwDark: "#1E222B",
        growwText: "#1E222B",
        growwMuted: "#7C7E8C",
        growwSubtle: "#F5F6F8",
        growwBorder: "#EBECEF",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
