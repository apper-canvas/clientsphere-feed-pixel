import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const SearchBar = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  onClear,
  className 
}) => {
  const [focused, setFocused] = useState(false)
  
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="w-4 h-4 text-slate-400" />
      </div>
      
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "w-full pl-10 pr-10 py-2 text-14 bg-white border rounded-lg",
          "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "transition-all duration-200",
          focused 
            ? "border-primary shadow-lg" 
            : "border-slate-300 hover:border-slate-400"
        )}
      />
      
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-700 text-slate-400 transition-colors"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default SearchBar