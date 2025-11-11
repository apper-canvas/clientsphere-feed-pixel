import React from "react"
import { useNavigate } from "react-router-dom"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { format, differenceInDays } from "date-fns"

const DealCard = ({ deal, contact, onStageChange, isDragging = false }) => {
  const navigate = useNavigate()
  
  const handleClick = (e) => {
    if (!isDragging) {
      e.stopPropagation()
      navigate(`/deals/${deal.Id}`)
    }
  }
  
  const getDaysInStage = () => {
    return differenceInDays(new Date(), new Date(deal.stageChangedAt))
  }
  
  const getStageColor = (stage) => {
    switch (stage) {
      case "Lead": return "default"
      case "Qualified": return "info"
      case "Proposal": return "warning"
      case "Negotiation": return "primary"
      case "Closed Won": return "success"
      case "Closed Lost": return "error"
      default: return "default"
    }
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: deal.currency || "USD"
    }).format(value)
  }
  
  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 ${isDragging ? "opacity-50 rotate-2 scale-105" : ""}`} 
      hover={!isDragging}
      onClick={handleClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-slate-900 text-14 line-clamp-2">{deal.title}</h3>
          <ApperIcon name="MoreVertical" className="w-4 h-4 text-slate-400" />
        </div>
        
        <div className="space-y-2">
          {contact && (
            <div className="flex items-center text-12 text-slate-600">
              <ApperIcon name="User" className="w-3 h-3 mr-1" />
              {contact.name}
            </div>
          )}
          <div className="flex items-center text-12 text-slate-600">
            <ApperIcon name="Building2" className="w-3 h-3 mr-1" />
            {contact?.company || "Unknown Company"}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="font-bold text-16 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {formatCurrency(deal.value)}
          </div>
          <Badge variant={getStageColor(deal.stage)} size="sm">
            {deal.stage}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-12 text-slate-500 border-t border-slate-100 pt-2">
          <span>{getDaysInStage()} days in stage</span>
          <span>{deal.probability}%</span>
        </div>
        
        {deal.expectedCloseDate && (
          <div className="text-12 text-slate-500">
            Expected: {format(new Date(deal.expectedCloseDate), "MMM d")}
          </div>
        )}
      </div>
    </Card>
  )
}

export default DealCard