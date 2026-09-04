import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        paper: "#fafafa",
        accent: "#f97316",
        muted: "#737373",
        border: "#e5e5e5",
        atmospheric: "#d4d4d4",
        surface: "#fafafa",
        archive: "#0a0a0a",
        "archive-muted": "#a3a3a3",
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        xs: "0 1px 2px rgb(0 0 0 / 0.04)",
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
        "card-hover": "0 12px 32px -8px rgb(0 0 0 / 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
