import React from "react"
import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { useAuth } from "@/layouts/Root"

const MobileSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth()
  const menuItems = [
    { icon: "LayoutDashboard", label: "Dashboard", path: "/" },
    { icon: "Users", label: "Contacts", path: "/contacts" },
    { icon: "Handshake", label: "Deals", path: "/deals" },
    { icon: "BarChart3", label: "Analytics", path: "/analytics" },
    { icon: "Settings", label: "Settings", path: "/settings" }
  ]
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden z-40",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-80 bg-white border-r border-slate-200 p-6 transition-transform duration-300 lg:hidden z-50",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-20 font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              ClientSphere
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-14 font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
<div className="mt-12 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-emerald-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Sparkles" className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-14 text-slate-900">Upgrade to Pro</h3>
              <p className="text-12 text-slate-600">Get advanced features</p>
            </div>
          </div>
          <button className="w-full px-3 py-2 bg-gradient-to-r from-accent to-emerald-600 text-white text-12 font-medium rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 transform hover:scale-105 mb-2">
            Learn More
          </button>
          <button
onClick={() => {
              logout();
            }}
            className="w-full px-3 py-2 bg-red-600 text-white text-12 font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default MobileSidebar