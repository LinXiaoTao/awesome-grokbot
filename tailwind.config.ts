import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accent: "#f97316",
        muted: "#6b7280",
        border: "#e5e7eb",
        atmospheric: "#d1d5db",
        surface: "#fafafa",
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
        "card-hover": "0 8px 24px -4px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
