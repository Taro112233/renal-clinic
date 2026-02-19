// components/ui/badge.tsx
"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-[var(--color-alert-success-bg)] text-[var(--color-alert-success-text)] hover:opacity-80",
        warning:
          "border-transparent bg-[var(--color-alert-warning-bg)] text-[var(--color-alert-warning-text)] hover:opacity-80",
        error:
          "border-transparent bg-[var(--color-alert-error-bg)] text-[var(--color-alert-error-text)] hover:opacity-80",
        info:
          "border-transparent bg-[var(--color-alert-info-bg)] text-[var(--color-alert-info-text)] hover:opacity-80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends Omit<HTMLMotionProps<"div">, keyof VariantProps<typeof badgeVariants> | "children">,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }