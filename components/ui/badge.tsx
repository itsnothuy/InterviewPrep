import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge variants with IBM Carbon Design status colors
 * Includes semantic status variants for room/interview states
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Default variants
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        dashboardAiOrHuman: "bg-gray-500/50 text-white hover:bg-customGray",
        
        // IBM Carbon Status Variants
        // Active status - green (for active rooms/sessions)
        active:
          "border-transparent bg-carbon-green-dark text-white",
        // Ended/Inactive status - gray
        ended:
          "border-transparent bg-carbon-gray-disabled text-white",
        // Success status - lighter green
        success:
          "border-transparent bg-carbon-green-success text-carbon-bg-primary",
        // Warning status - yellow
        warning:
          "border-transparent bg-carbon-yellow-warning text-carbon-bg-primary",
        // Error status - red
        error:
          "border-transparent bg-carbon-red-error text-white",
        // Info status - blue
        info:
          "border-transparent bg-carbon-blue-primary text-white",
        // Pending status - subtle gray with border
        pending:
          "border-carbon-border-medium bg-carbon-bg-tertiary text-carbon-text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
