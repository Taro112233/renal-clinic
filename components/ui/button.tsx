// components/ui/button.tsx
"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow",
        destructive:
          "bg-destructive text-white shadow-sm",
        outline:
          "border border-border-primary bg-surface-primary shadow-sm text-content-primary hover:bg-surface-interactive",
        secondary:
          "bg-surface-secondary text-content-primary shadow-sm hover:bg-surface-interactive",
        ghost: "text-content-primary hover:bg-surface-interactive",
        link: "text-interactive-primary underline-offset-4 hover:opacity-80",
        primary: "bg-interactive-primary text-white shadow hover:bg-interactive-primary-hover",
        success: "bg-alert-success-icon text-white shadow hover:opacity-90",
        warning: "bg-alert-warning-icon text-white shadow hover:opacity-90",
        danger: "bg-alert-error-icon text-white shadow hover:opacity-90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, keyof VariantProps<typeof buttonVariants> | "children">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, asChild, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.05 }}
        {...props}
      >
        {loading && (
          <motion.svg
            className="mr-2 h-4 w-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </motion.svg>
        )}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }