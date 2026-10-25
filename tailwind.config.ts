import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aurelle: {
          bg: "#FAFAF7",
          "bg-secondary": "#F2F7FC",
          "cotton-blue": "#A9D6F5",
          "action-blue": "#78B9E8",
          "action-hover": "#62A7DB",
          "navy-text": "#1F3045",
          "text-muted": "#748398",
          border: "#E4EAF0",
          surface: "#FFFFFF",
          blush: "#F5E5E9",
          success: "#5C9E82",
          warning: "#C68C4D",
          error: "#C76570",
          // Dark mode complementary palette
          "dark-bg": "#0D1520",
          "dark-surface": "#152030",
          "dark-card": "#1A273B",
          "dark-border": "#243750",
          "dark-text": "#EDF2F7",
          "dark-text-muted": "#90A0B5",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        control: "10px",
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(31, 48, 69, 0.05), 0 1px 3px rgba(31, 48, 69, 0.03)",
        card: "0 4px 20px -4px rgba(31, 48, 69, 0.06), 0 2px 6px -1px rgba(31, 48, 69, 0.02)",
        "card-hover": "0 8px 24px -4px rgba(31, 48, 69, 0.09), 0 3px 8px -1px rgba(31, 48, 69, 0.04)",
        neumorph: "3px 4px 12px rgba(31, 48, 69, 0.04), -3px -3px 10px rgba(255, 255, 255, 0.8)",
        "neumorph-inset": "inset 1px 2px 4px rgba(31, 48, 69, 0.05)",
        "action-glow": "0 4px 14px 0 rgba(120, 185, 232, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
