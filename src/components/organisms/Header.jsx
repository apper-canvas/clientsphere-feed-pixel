import React from "react"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ 
  title, 
  subtitle, 
  searchValue, 
  onSearchChange, 
  onSearchClear,
  showSearch = false,
  actionLabel,
  actionIcon,
  onAction,
  onMenuClick
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" className="w-5 h-5 text-slate-700" />
          </button>
          
          <div>
            <h1 className="text-24 font-bold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-14 text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden md:block">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                onClear={onSearchClear}
                placeholder="Search contacts, deals..."
                className="w-80"
              />
            </div>
          )}
          
          {actionLabel && (
            <Button
              onClick={onAction}
              icon={actionIcon}
              variant="primary"
            >
              {actionLabel}
            </Button>
          )}
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
              <ApperIcon name="Bell" className="w-5 h-5 text-slate-700" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></div>
            </button>
            
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-14">JS</span>
            </div>
          </div>
        </div>
      </div>
      
      {showSearch && (
        <div className="md:hidden mt-4">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            onClear={onSearchClear}
            placeholder="Search contacts, deals..."
          />
        </div>
      )}
    </div>
  )
}

export default Header