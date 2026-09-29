/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBFAF7",
        ink: "#1B1F2A",
        marker: "#FFC53D",
        rust: "#C1442E",
        moss: "#2F6F4E",
        line: "#E4E1D8",
      },
      fontFamily: {
        display: ["var(--font-fraunces)"],
        sans: ["var(--font-manrope)"],
        mono: ["var(--font-plex-mono)"],
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        sweep: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        sweep: "sweep 1.1s cubic-bezier(0.65, 0, 0.35, 1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
