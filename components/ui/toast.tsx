"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      // Changed to bottom-right positioning per CodePair Blueprint
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col p-6 gap-3 sm:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

/**
 * Toast variants following IBM Carbon Design patterns
 * Each variant has a colored left border for quick visual identification
 */
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-sm border border-carbon-border-subtle bg-carbon-bg-primary p-4 shadow-lg transition-all animate-slide-in hover:shadow-xl data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=closed]:animate-slide-out",
  {
    variants: {
      variant: {
        // Default - subtle styling
        default: "border-l-4 border-l-carbon-border-medium",
        // Success - green left border (IBM Carbon #42be65)
        success: "border-l-4 border-l-carbon-green-success",
        // Error/Destructive - red left border (IBM Carbon #fa4d56)
        destructive: "border-l-4 border-l-carbon-red-error",
        // Warning - yellow left border (IBM Carbon #f1c21b)
        warning: "border-l-4 border-l-carbon-yellow-warning",
        // Info - blue left border (IBM Carbon #0f62fe)
        info: "border-l-4 border-l-carbon-blue-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Get the appropriate icon for each toast variant
 */
const ToastIcon = ({ variant }: { variant?: "default" | "success" | "destructive" | "warning" | "info" | null }) => {
  const iconProps = { size: 20, className: "flex-shrink-0" };
  
  switch (variant) {
    case "success":
      return <CheckCircle {...iconProps} className={cn(iconProps.className, "text-carbon-green-success")} />;
    case "destructive":
      return <XCircle {...iconProps} className={cn(iconProps.className, "text-carbon-red-error")} />;
    case "warning":
      return <AlertTriangle {...iconProps} className={cn(iconProps.className, "text-carbon-yellow-warning")} />;
    case "info":
      return <Info {...iconProps} className={cn(iconProps.className, "text-carbon-blue-primary")} />;
    default:
      return null;
  }
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-sm border border-carbon-border-medium bg-transparent px-3 text-sm font-medium text-carbon-text-primary transition-colors hover:bg-carbon-bg-tertiary focus:outline-none focus:ring-2 focus:ring-violet focus:ring-offset-2 focus:ring-offset-carbon-bg-primary disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "flex-shrink-0 rounded-sm p-1 text-carbon-text-tertiary transition-colors hover:text-carbon-text-primary focus:outline-none focus:ring-2 focus:ring-violet cursor-pointer",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold text-carbon-text-primary", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm text-carbon-text-secondary", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
  toastVariants,
}
