import * as React from "react"
import { cn } from "../../lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-emerald-500 text-white shadow",
    secondary: "bg-gray-100 text-gray-900",
    destructive: "bg-red-500 text-white shadow",
    outline: "border-2 border-emerald-500 text-emerald-700 bg-emerald-50",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
