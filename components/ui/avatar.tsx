// components/ui/avatar.tsx
"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export interface AvatarProps extends HTMLMotionProps<"div"> {
  size?: "sm" | "md" | "lg" | "xl"
  status?: "online" | "offline" | "away" | "busy"
  children?: React.ReactNode
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", status, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          className
        )}
        whileHover={{ scale: 1.05 }}
        {...props}
      >
        {props.children}
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
              size === "sm" && "h-2 w-2",
              size === "md" && "h-2.5 w-2.5",
              size === "lg" && "h-3 w-3",
              size === "xl" && "h-4 w-4",
              status === "online" && "bg-green-500",
              status === "offline" && "bg-gray-400",
              status === "away" && "bg-yellow-500",
              status === "busy" && "bg-red-500"
            )}
          />
        )}
      </motion.div>
    )
  }
)
Avatar.displayName = "Avatar"

// Fixed AvatarImage: Added missing < and correct React.ComponentRef
const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof Image>,
  React.ComponentPropsWithoutRef<typeof Image>
>(({ className, alt = "", src, ...props }, ref) => {
  if (!src) return null;

  return (
    <Image
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover", className)}
      alt={alt}
      src={src}
      width={96}
      height={96}
      {...props}
    />
  );
})
AvatarImage.displayName = "AvatarImage"

// Fixed AvatarFallback: Added missing < and used React.HTMLAttributes
const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }