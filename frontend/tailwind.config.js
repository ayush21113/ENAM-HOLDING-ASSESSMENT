/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f8f9fa",
        surface: "#ffffff",
        subtle: "#f1f3f5",
        ink: "#111827",
        inkSecondary: "#4b5563",
        inkMuted: "#6b7280",
        line: "#e5e7eb",
        brand: "#1e40af",
        brandLight: "#eff6ff",
        gain: "#166534",
        gainBg: "#f0fdf4",
        loss: "#991b1b",
        lossBg: "#fef2f2",
        amberAlert: "#92400e",
        amberAlertBg: "#fffbeb",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        elevated: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)",
      }
    },
  },
  plugins: [],
}
