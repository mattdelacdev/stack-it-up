import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D946EF",
        secondary: "#06B6D4",
        accent: "#FBBF24",
        bg: "#1E1B4B",
        "bg-deep": "#15123A",
        text: "#E9D5FF",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        retro: "6px 6px 0 0 #FBBF24",
        "retro-sm": "3px 3px 0 0 #FBBF24",
        "retro-primary": "6px 6px 0 0 #D946EF",
        "retro-secondary": "6px 6px 0 0 #06B6D4",
        glow: "0 0 20px rgba(217, 70, 239, 0.5), 0 0 40px rgba(217, 70, 239, 0.3)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)",
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        flicker: "flicker 3s infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { "box-shadow": "0 0 20px rgba(217, 70, 239, 0.5)" },
          "50%": { "box-shadow": "0 0 40px rgba(217, 70, 239, 0.8)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
