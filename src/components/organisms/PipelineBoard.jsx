import React, { useState, useEffect } from "react"
import DealCard from "@/components/molecules/DealCard"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import { dealService } from "@/services/api/dealService"
import { contactService } from "@/services/api/contactService"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"

const PipelineBoard = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [draggedDeal, setDraggedDeal] = useState(null)
  
  const stages = [
    { id: "Lead", title: "Lead", color: "bg-slate-100" },
    { id: "Qualified", title: "Qualified", color: "bg-blue-100" },
    { id: "Proposal", title: "Proposal", color: "bg-yellow-100" },
    { id: "Negotiation", title: "Negotiation", color: "bg-purple-100" },
    { id: "Closed Won", title: "Closed Won", color: "bg-green-100" },
    { id: "Closed Lost", title: "Closed Lost", color: "bg-red-100" }
  ]
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      
      setDeals(dealsData)
      setContacts(contactsData)
    } catch (err) {
      setError(err.message || "Failed to load pipeline data")
    } finally {
      setLoading(false)
    }
  }
  
  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage)
  }
  
  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId)
  }
  
  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = "move"
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }
  
  const handleDrop = async (e, newStage) => {
    e.preventDefault()
    
    if (!draggedDeal || draggedDeal.stage === newStage) {
      setDraggedDeal(null)
      return
    }
    
    try {
      const updatedDeal = await dealService.updateStage(draggedDeal.Id, newStage)
      setDeals(prev => prev.map(deal => 
        deal.Id === draggedDeal.Id ? updatedDeal : deal
      ))
      toast.success(`Deal moved to ${newStage}`)
    } catch (error) {
      toast.error("Failed to update deal stage")
    } finally {
      setDraggedDeal(null)
    }
  }
  
  const handleDragEnd = () => {
    setDraggedDeal(null)
  }
  
  const calculateStageValue = (stage) => {
    const stageDeals = getDealsByStage(stage)
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0)
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />
  if (deals.length === 0) {
    return (
      <Empty 
        title="No deals in pipeline"
        message="Start by creating your first deal to track opportunities through your sales process."
        actionLabel="Create Deal"
        icon="Handshake"
      />
    )
  }
  
  return (
    <div className="h-full overflow-x-auto">
      <div className="flex space-x-6 min-w-[1200px] h-full">
        {stages.map(stage => {
          const stageDeals = getDealsByStage(stage.id)
          const stageValue = calculateStageValue(stage.id)
          
          return (
            <div
              key={stage.id}
              className="flex-1 min-w-[280px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className={cn("rounded-lg p-4 mb-4", stage.color)}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{stage.title}</h3>
                  <span className="text-12 font-medium text-slate-600">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-14 font-bold text-slate-900">
                  {formatCurrency(stageValue)}
                </p>
              </div>
              
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {stageDeals.map(deal => (
                  <div
                    key={deal.Id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    onDragEnd={handleDragEnd}
                  >
                    <DealCard
                      deal={deal}
                      contact={getContactById(deal.contactId)}
                      isDragging={draggedDeal?.Id === deal.Id}
                    />
                  </div>
                ))}
                
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p className="text-14">No deals in {stage.title}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PipelineBoard