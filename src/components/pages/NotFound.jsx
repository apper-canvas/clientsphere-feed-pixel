import React from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="AlertTriangle" className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-64 font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-24 font-semibold text-slate-900">Page Not Found</h2>
            <p className="text-16 text-slate-600 leading-relaxed">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/")}
            icon="Home"
            className="w-full"
          >
            Go to Dashboard
          </Button>
          
          <div className="flex items-center justify-center space-x-6 text-14 text-slate-500">
            <button
              onClick={() => navigate("/contacts")}
              className="hover:text-primary transition-colors flex items-center space-x-1"
            >
              <ApperIcon name="Users" className="w-4 h-4" />
              <span>Contacts</span>
            </button>
            <button
              onClick={() => navigate("/deals")}
              className="hover:text-primary transition-colors flex items-center space-x-1"
            >
              <ApperIcon name="Handshake" className="w-4 h-4" />
              <span>Deals</span>
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="hover:text-primary transition-colors flex items-center space-x-1"
            >
              <ApperIcon name="BarChart3" className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-center space-x-2 text-slate-500">
            <div className="w-6 h-6 bg-gradient-to-r from-primary to-blue-600 rounded-md flex items-center justify-center">
              <ApperIcon name="Zap" className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">ClientSphere CRM</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound