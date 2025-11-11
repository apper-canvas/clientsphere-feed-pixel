import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  loading = false, 
  icon, 
  iconPosition = "left",
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-primary shadow-lg hover:shadow-xl hover:scale-105",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500 shadow-sm hover:shadow-md",
    success: "bg-gradient-to-r from-accent to-emerald-600 text-white hover:from-emerald-700 hover:to-emerald-800 focus:ring-accent shadow-lg hover:shadow-xl hover:scale-105",
    warning: "bg-gradient-to-r from-warning to-amber-500 text-white hover:from-amber-600 hover:to-amber-700 focus:ring-warning shadow-lg hover:shadow-xl hover:scale-105",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-700 hover:to-red-800 focus:ring-error shadow-lg hover:shadow-xl hover:scale-105",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-500"
  }
  
  const sizes = {
    sm: "text-12 px-3 py-1.5 rounded-md",
    md: "text-14 px-4 py-2 rounded-lg",
    lg: "text-16 px-6 py-3 rounded-lg"
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
      ) : icon && iconPosition === "left" ? (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      ) : null}
      
      {children}
      
      {!loading && icon && iconPosition === "right" ? (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      ) : null}
    </button>
  )
})

Button.displayName = "Button"

export default Button