import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error,
  label,
  required,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-14 font-medium text-slate-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex w-full px-3 py-2 text-14 bg-white border rounded-lg",
          "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          "transition-all duration-200",
          error 
            ? "border-error focus:ring-error" 
            : "border-slate-300 hover:border-slate-400",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-12 text-error font-medium">{error}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input