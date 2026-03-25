/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF4500",
          600: "#E03F00",
          50: "#FFF3EE",
          100: "#FFE0D1",
        },
        secondary: {
          DEFAULT: "#FFD700",
          600: "#E6C200",
        },
        dark: "#1A1A2E",
        brand: {
          bg: "#FFF8F0",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(16,24,40,0.06)",
        modal: "0 4px 14px rgba(16,24,40,0.08)",
      },
    },
  },
  plugins: [],
};


