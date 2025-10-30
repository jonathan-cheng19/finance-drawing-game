import * as React from "react"
import { cn } from "../../lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-blue-600 text-white",
    secondary: "bg-green-600 text-white",
    destructive: "bg-red-600 text-white",
    outline: "border-2 border-gray-400 text-gray-700 bg-white/50",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
