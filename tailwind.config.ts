import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        customGray: '#cccccc',
        
        // IBM Carbon Design System Colors (from CodePair Blueprint)
        carbon: {
          // Backgrounds
          'bg-primary': '#161616',
          'bg-secondary': '#262626',
          'bg-tertiary': '#353535',
          'bg-quaternary': '#4c4c4c',
          // Borders
          'border-subtle': '#393939',
          'border-medium': '#525252',
          'border-strong': '#4c4c4c',
          // Text
          'text-primary': '#f4f4f4',
          'text-secondary': '#c6c6c6',
          'text-tertiary': '#8d8d8d',
          'text-quaternary': '#6f6f6f',
          // Interactive
          'blue-primary': '#0f62fe',
          'blue-hover': '#0353e9',
          'blue-active': '#002d9c',
          // Status
          'green-success': '#42be65',
          'green-dark': '#198038',
          'red-error': '#fa4d56',
          'red-hover': '#da1e28',
          'red-active': '#bc1a23',
          'yellow-warning': '#f1c21b',
          // Disabled
          'gray-disabled': '#8d8d8d',
        },
        
        primary: {
          DEFAULT: "rgb(251 146 60)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        bg: "var(--bg)",
        surface: "var(--surface)",
        text: "var(--text)",
        violet: "var(--violet)",
        violet2: "var(--violet-2)",
        magenta: "var(--magenta)",
        cyan: "var(--cyan)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Toast animations from CodePair Blueprint
        "slide-in": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out": {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(100%)", opacity: "0" },
        },
        "shrink": {
          from: { transform: "scaleX(1)" },
          to: { transform: "scaleX(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.2s ease-out",
        "slide-out": "slide-out 0.2s ease-out",
        "shrink": "shrink linear",
        "fade-in": "fade-in 0.15s ease-in-out",
        "fade-out": "fade-out 0.15s ease-in-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient": "var(--grad-hero)",
      },
      boxShadow: {
        ring: "var(--ring)",
        glow: "var(--glow)",
        "navbar-custom": "rgba(34, 42, 53, 0.06) 0px 0px 24px, rgba(0, 0, 0, 0.05) 0px 1px 0px, rgba(34, 42, 53, 0.04) 0px 0px 1px, rgba(34, 42, 53, 0.08) 0px 0px 4px, rgba(47, 48, 55, 0.05) 0px 16px 68px, rgba(255, 255, 255, 0.1) 0px 1px 0px inset",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
