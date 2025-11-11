import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  actionLabel = "Add Item",
  onAction,
  icon = "Plus"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-slate-400" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-20 font-semibold text-slate-900">{title}</h3>
          <p className="text-14 text-slate-600 leading-relaxed">{message}</p>
        </div>

        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </button>
        )}

        <div className="grid grid-cols-2 gap-4 mt-8 text-12 text-slate-500">
          <div className="flex items-center">
            <ApperIcon name="Zap" className="w-4 h-4 mr-2 text-blue-400" />
            Quick Setup
          </div>
          <div className="flex items-center">
            <ApperIcon name="Shield" className="w-4 h-4 mr-2 text-green-400" />
            Secure Data
          </div>
        </div>
      </div>
    </div>
  )
}

export default Empty