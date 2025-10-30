import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 backdrop-blur-sm border-2 border-white/20 shadow-lg hover:shadow-2xl hover:scale-105"

  const variants = {
    default: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700",
    destructive: "bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800",
    outline: "border-2 border-cyan-500 bg-white/70 backdrop-blur-md text-cyan-700 hover:bg-white/90",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-700 hover:to-gray-900",
    ghost: "hover:bg-white/20 backdrop-blur-md text-gray-800 border-transparent",
    link: "text-cyan-600 underline-offset-4 hover:underline border-transparent shadow-none",
  }

  const sizes = {
    default: "h-12 px-8 py-3 text-base",
    sm: "h-10 rounded-lg px-6 py-2 text-sm",
    lg: "h-16 rounded-xl px-10 py-4 text-lg",
    icon: "h-12 w-12",
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
