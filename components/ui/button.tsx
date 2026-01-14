import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button variants following IBM Carbon Design patterns
 * with consistent focus rings and hover states
 */
const buttonVariants = cva(
  // Base styles with consistent focus ring pattern
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        // Primary action - IBM Carbon blue pattern
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        
        // Destructive - IBM Carbon red pattern
        destructive:
          "bg-carbon-red-error text-white hover:bg-carbon-red-hover active:bg-carbon-red-active focus-visible:ring-carbon-red-error",
        
        // Outline/Ghost style - Carbon transparent pattern
        outline:
          "border border-carbon-border-medium bg-transparent text-foreground hover:bg-carbon-bg-tertiary hover:border-carbon-border-strong active:bg-carbon-bg-quaternary",
        
        // Secondary - Lighter emphasis
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        
        // Ghost - No background until hover
        ghost: "hover:bg-carbon-bg-tertiary hover:text-foreground active:bg-carbon-bg-quaternary",
        
        // Link style
        link: "underline-offset-4 hover:underline text-primary",

        // Dashboard styles (preserved for compatibility)
        dashboard: "bg-customGray text-white hover:bg-gray-500/90 active:bg-gray-600/90",
        dashboardAiOrHuman: "bg-gray-500/50 text-white hover:bg-customGray active:bg-gray-400/50",
        
        // Interview coder gradient style
        interviewCoder:
          "bg-hero-gradient text-white rounded-full px-5 py-3 font-semibold shadow-ring shadow-glow transition-all duration-150 ease-in-out hover:-translate-y-px hover:brightness-105 active:translate-y-0 active:brightness-95",
        
        // Carbon-style danger button (for delete actions)
        danger:
          "bg-carbon-red-error/10 text-carbon-red-error border border-carbon-red-error/20 hover:bg-carbon-red-error hover:text-white active:bg-carbon-red-active focus-visible:ring-carbon-red-error",
        
        // Carbon-style success button
        success:
          "bg-carbon-green-success text-white hover:bg-carbon-green-dark active:brightness-90 focus-visible:ring-carbon-green-success",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // Carbon-style compact button
        compact: "h-8 px-4 text-xs font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
