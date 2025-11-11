import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/organisms/Sidebar"
import MobileSidebar from "@/components/organisms/MobileSidebar"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }
  
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:block lg:w-64 lg:flex-shrink-0" />
      
      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet context={{ onMenuClick: handleSidebarToggle }} />
      </div>
    </div>
  )
}

export default Layout