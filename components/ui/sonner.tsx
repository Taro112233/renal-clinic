// components/ui/sonner.tsx
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"
import * as React from "react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // mapping สีพื้นฐานของ toast
      style={{
        "--normal-bg": "var(--color-surface-secondary)",
        "--normal-text": "var(--color-content-primary)",
        "--normal-border": "var(--color-border-primary)",
      } as React.CSSProperties}
      icons={{
        // ใช้ icon color จาก semantic tokens ที่คุณตั้งไว้
        success: <CheckCircle className="h-5 w-5 text-[var(--color-alert-success-icon)]" />,
        error: <XCircle className="h-5 w-5 text-[var(--color-alert-error-icon)]" />,
        warning: <AlertCircle className="h-5 w-5 text-[var(--color-alert-warning-icon)]" />,
        info: <Info className="h-5 w-5 text-[var(--color-alert-info-icon)]" />,
      }}
      toastOptions={{
        // ปรับแต่ง class ตามประเภทของ toast
        unstyled: false,
        classNames: {
          toast: "group !rounded-lg !border !p-4 !shadow-lg",
          // ดึงสีพื้นหลังและสีตัวอักษรมาจาก Semantic Tokens โดยตรง
          success: "!bg-[var(--color-alert-success-bg)] !text-[var(--color-alert-success-text)] !border-[var(--color-alert-success-border)]",
          error: "!bg-[var(--color-alert-error-bg)] !text-[var(--color-alert-error-text)] !border-[var(--color-alert-error-border)]",
          warning: "!bg-[var(--color-alert-warning-bg)] !text-[var(--color-alert-warning-text)] !border-[var(--color-alert-warning-border)]",
          info: "!bg-[var(--color-alert-info-bg)] !text-[var(--color-alert-info-text)] !border-[var(--color-alert-info-border)]",
          description: "!text-current !opacity-80", // ให้สี description ไหลตามสี text ของ variant นั้นๆ
          actionButton: "group-data-[type=success]:!bg-[var(--color-alert-success-icon)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }