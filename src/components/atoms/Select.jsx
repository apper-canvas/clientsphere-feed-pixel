import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Select = forwardRef(({ 
  className, 
  error,
  label,
  required,
  children,
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
      <select
        className={cn(
          "flex w-full px-3 py-2 text-14 bg-white border rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          "transition-all duration-200",
          error 
            ? "border-error focus:ring-error" 
            : "border-slate-300 hover:border-slate-400",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-12 text-error font-medium">{error}</p>
      )}
    </div>
  )
})

Select.displayName = "Select"

export default Select