import React from "react"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ title = "Something went wrong", message = "We encountered an error while loading your data. Please try again.", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-20 font-semibold text-slate-900">{title}</h3>
          <p className="text-14 text-slate-600 leading-relaxed">{message}</p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}

        <div className="flex items-center justify-center space-x-6 text-12 text-slate-500">
          <button className="hover:text-primary transition-colors">
            <ApperIcon name="HelpCircle" className="w-4 h-4 inline mr-1" />
            Get Help
          </button>
          <button className="hover:text-primary transition-colors">
            <ApperIcon name="MessageSquare" className="w-4 h-4 inline mr-1" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorView