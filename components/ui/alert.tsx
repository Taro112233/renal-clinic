// components/ui/alert.tsx
"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground [&>svg]:text-foreground",
        info: "border-[var(--color-alert-info-border)] bg-[var(--color-alert-info-bg)] text-[var(--color-alert-info-text)] [&>svg]:text-[var(--color-alert-info-icon)]",
        success: "border-[var(--color-alert-success-border)] bg-[var(--color-alert-success-bg)] text-[var(--color-alert-success-text)] [&>svg]:text-[var(--color-alert-success-icon)]",
        warning: "border-[var(--color-alert-warning-border)] bg-[var(--color-alert-warning-bg)] text-[var(--color-alert-warning-text)] [&>svg]:text-[var(--color-alert-warning-icon)]",
        destructive: "border-[var(--color-alert-error-border)] bg-[var(--color-alert-error-bg)] text-[var(--color-alert-error-text)] [&>svg]:text-[var(--color-alert-error-icon)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  destructive: XCircle,
} as const

export interface AlertProps
  extends Omit<HTMLMotionProps<"div">, keyof VariantProps<typeof alertVariants> | "children">,
    VariantProps<typeof alertVariants> {
  showIcon?: boolean
  children?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", showIcon = true, children, ...props }, ref) => {
    const Icon = iconMap[variant || "default"]

    return (
      <motion.div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        {...props}
      >
        {showIcon && <Icon className="h-5 w-5" />}
        {children}
      </motion.div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }