import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95"
  
  const variants = {
    default: "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-800",
    destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
    outline: "border-2 border-emerald-600 bg-white text-emerald-700 shadow-sm hover:bg-emerald-50 hover:shadow-md",
    secondary: "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    link: "text-emerald-600 underline-offset-4 hover:underline",
  }
  
  const sizes = {
    default: "h-12 px-6 py-3 text-sm",
    sm: "h-9 rounded-lg px-3 text-xs",
    lg: "h-14 rounded-xl px-8 text-base",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
