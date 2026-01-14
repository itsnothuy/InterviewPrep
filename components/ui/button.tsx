import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button variants with InterviewCoder gold theme
 * Updated to use gold primary accent instead of violet
 */
const buttonVariants = cva(
  // Base styles with gold focus ring
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        // Primary action - Gold CTA button
        default: "bg-primary text-primary-foreground hover:bg-gold-dark active:bg-gold-dark/90 font-semibold",
        
        // Destructive - Red pattern
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        
        // Outline style
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground active:bg-muted/80",
        
        // Secondary - Muted emphasis
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        
        // Ghost - Minimal style
        ghost: "hover:bg-muted hover:text-foreground active:bg-muted/80",
        
        // Link style with gold
        link: "underline-offset-4 hover:underline text-primary hover:text-gold-light",

        // Dashboard styles (preserved for compatibility)
        dashboard: "bg-customGray text-white hover:bg-gray-500/90 active:bg-gray-600/90",
        dashboardAiOrHuman: "bg-gray-500/50 text-white hover:bg-customGray active:bg-gray-400/50",
        
        // Interview coder gold gradient CTA
        interviewCoder:
          "bg-hero-gradient text-primary-foreground rounded-full px-6 py-3 font-bold shadow-ring shadow-glow transition-all duration-150 ease-in-out hover:-translate-y-px hover:brightness-110 active:translate-y-0 active:brightness-95",
        
        // Danger button
        danger:
          "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground active:bg-destructive/90",
        
        // Success button  
        success:
          "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
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
