import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        "bg-deep": "rgb(var(--color-bg-deep) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        retro: "6px 6px 0 0 rgb(var(--color-accent))",
        "retro-sm": "3px 3px 0 0 rgb(var(--color-accent))",
        "retro-primary": "6px 6px 0 0 rgb(var(--color-primary))",
        "retro-secondary": "6px 6px 0 0 rgb(var(--color-secondary))",
        glow: "0 0 20px rgb(var(--color-primary) / 0.5), 0 0 40px rgb(var(--color-primary) / 0.3)",
        "glow-cyan": "0 0 20px rgb(var(--color-secondary) / 0.5), 0 0 40px rgb(var(--color-secondary) / 0.3)",
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
