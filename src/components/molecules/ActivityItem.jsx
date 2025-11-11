import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"
import { cn } from "@/utils/cn"

const ActivityItem = ({ activity, isLast = false }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "call": return "Phone"
      case "email": return "Mail"
      case "meeting": return "Calendar"
      case "note": return "FileText"
      default: return "Activity"
    }
  }
  
  const getActivityColor = (type) => {
    switch (type) {
      case "call": return "text-blue-500 bg-blue-100"
      case "email": return "text-green-500 bg-green-100"
      case "meeting": return "text-purple-500 bg-purple-100"
      case "note": return "text-slate-500 bg-slate-100"
      default: return "text-slate-500 bg-slate-100"
    }
  }
  
  return (
    <div className="flex items-start space-x-4">
      <div className="relative">
        <div className={cn("p-2 rounded-full", getActivityColor(activity.type))}>
          <ApperIcon name={getActivityIcon(activity.type)} className="w-4 h-4" />
        </div>
        {!isLast && (
          <div className="absolute top-10 left-1/2 w-px h-6 bg-slate-200 transform -translate-x-1/2" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-14 font-medium text-slate-900 capitalize">{activity.type}</p>
          <span className="text-12 text-slate-500">
            {format(new Date(activity.timestamp), "MMM d, h:mm a")}
          </span>
        </div>
        <p className="text-14 text-slate-600 mt-1">{activity.description}</p>
        <p className="text-12 text-slate-500 mt-1">by {activity.createdBy}</p>
      </div>
    </div>
  )
}

export default ActivityItem