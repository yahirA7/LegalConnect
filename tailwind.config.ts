import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: "hsl(var(--destructive))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        charcoal: {
          DEFAULT: "#1a1a1a",
          light: "#2d2d2d",
          dark: "#0f0f0f",
        },
        cream: {
          DEFAULT: "#faf8f5",
          light: "#fdfcfb",
          dark: "#f5f0e8",
        },
        midnight: {
          DEFAULT: "#0f172a",
          light: "#1e293b",
          dark: "#020617",
        },
        gold: {
          DEFAULT: "#b8860b",
          light: "#d4a017",
          dark: "#8b6914",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        elevated: "var(--shadow-elevated)",
        glow: "var(--shadow-glow)",
        "card": "0 2px 8px -2px rgb(15 23 42 / 0.04), 0 4px 16px -4px rgb(15 23 42 / 0.03)",
        "card-hover": "0 8px 24px -4px rgb(15 23 42 / 0.06), 0 16px 48px -8px rgb(15 23 42 / 0.05)",
        "inner-soft": "inset 0 1px 2px 0 rgb(255 255 255 / 0.5)",
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
      },
    },
  },
  plugins: [],
};

export default config;
