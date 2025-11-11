import React from "react"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "blue",
  className 
}) => {
  const iconColors = {
    blue: "text-blue-500 bg-blue-100",
    green: "text-green-500 bg-green-100",
    yellow: "text-yellow-500 bg-yellow-100",
    red: "text-red-500 bg-red-100",
    purple: "text-purple-500 bg-purple-100"
  }
  
  const trendColors = {
    up: "text-green-600 bg-green-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-slate-600 bg-slate-50"
  }
  
  return (
    <Card className={cn("p-6", className)} hover>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-14 font-medium text-slate-600">{title}</h3>
        <div className={cn("p-2 rounded-lg", iconColors[color])}>
          <ApperIcon name={icon} className="w-5 h-5" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="text-32 font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {value}
        </div>
        
        {trend && (
          <div className={cn("inline-flex items-center px-2 py-1 rounded-full text-12 font-medium", trendColors[trend])}>
            <ApperIcon 
              name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
              className="w-3 h-3 mr-1" 
            />
            {trendValue}
          </div>
        )}
      </div>
    </Card>
  )
}

export default MetricCard