import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#123f38",
          green: "#62c33a",
          green2: "#3d9646",
          cream: "#f7f5eb",
          paper: "#fffefa",
          soft: "#edf5e7",
          line: "#dce5da",
          text: "#263630",
          muted: "#718079",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 50px rgba(24,61,42,.10)",
        booking: "0 16px 45px rgba(21,59,48,.10)",
      },
    },
  },
  plugins: [],
};

export default config;
