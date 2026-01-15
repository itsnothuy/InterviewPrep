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
        // P1.1a: Updated to use CSS custom properties from globals.css
        carbon: {
          // Backgrounds
          'bg-primary': 'var(--carbon-bg-primary)',
          'bg-secondary': 'var(--carbon-bg-secondary)',
          'bg-tertiary': 'var(--carbon-bg-tertiary)',
          'bg-quaternary': 'var(--carbon-bg-quaternary)',
          // Text
          'text-primary': 'var(--carbon-text-primary)',
          'text-secondary': 'var(--carbon-text-secondary)',
          'text-tertiary': 'var(--carbon-text-tertiary)',
          'text-quaternary': 'var(--carbon-text-quaternary)',
          'text-placeholder': 'var(--carbon-text-placeholder)',
          'text-on-color': 'var(--carbon-text-on-color)',
          // Borders
          'border-subtle': 'var(--carbon-border-subtle)',
          'border-medium': 'var(--carbon-border-medium)',
          'border-strong': 'var(--carbon-border-strong)',
          // Interactive
          'interactive-primary': 'var(--carbon-interactive-primary)',
          'interactive-primary-hover': 'var(--carbon-interactive-primary-hover)',
          'interactive-primary-active': 'var(--carbon-interactive-primary-active)',
          // Status
          'success': 'var(--carbon-success)',
          'success-hover': 'var(--carbon-success-hover)',
          'error': 'var(--carbon-error)',
          'error-hover': 'var(--carbon-error-hover)',
          'warning': 'var(--carbon-warning)',
          'warning-hover': 'var(--carbon-warning-hover)',
          'info': 'var(--carbon-info)',
          // Focus
          'focus': 'var(--carbon-focus)',
          'focus-inset': 'var(--carbon-focus-inset)',
          // Layers
          'layer-01': 'var(--carbon-layer-01)',
          'layer-02': 'var(--carbon-layer-02)',
          'layer-03': 'var(--carbon-layer-03)',
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
        gold: "var(--gold)",
        "gold-light": "var(--gold-light)",
        "gold-dark": "var(--gold-dark)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // P1.1a: IBM Carbon border radius tokens
        'carbon-sm': 'var(--carbon-radius-sm)',
        'carbon-md': 'var(--carbon-radius-md)',
        'carbon-lg': 'var(--carbon-radius-lg)',
      },
      spacing: {
        // P1.1a: IBM Carbon spacing scale (4px grid system)
        'carbon-01': 'var(--carbon-spacing-01)', // 2px
        'carbon-02': 'var(--carbon-spacing-02)', // 4px
        'carbon-03': 'var(--carbon-spacing-03)', // 8px
        'carbon-04': 'var(--carbon-spacing-04)', // 12px
        'carbon-05': 'var(--carbon-spacing-05)', // 16px
        'carbon-06': 'var(--carbon-spacing-06)', // 24px
        'carbon-07': 'var(--carbon-spacing-07)', // 32px
        'carbon-08': 'var(--carbon-spacing-08)', // 40px
        'carbon-09': 'var(--carbon-spacing-09)', // 48px
        'carbon-10': 'var(--carbon-spacing-10)', // 64px
      },
      transitionDuration: {
        // P1.1a: IBM Carbon transition durations
        'carbon-fast': '110ms',
        'carbon-moderate': '240ms',
        'carbon-slow': '400ms',
      },
      transitionTimingFunction: {
        // P1.1a: IBM Carbon easing
        'carbon': 'cubic-bezier(0.2, 0, 0.38, 0.9)',
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
