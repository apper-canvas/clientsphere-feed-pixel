import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { dealService } from "@/services/api/dealService";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealForm from "@/components/organisms/DealForm";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Deals = () => {
  const { onMenuClick } = useOutletContext()
  const navigate = useNavigate()
  
  const [showForm, setShowForm] = useState(false)
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    loadDeals()
  }, [])
  
  const loadDeals = async () => {
    try {
      setLoading(true)
      setError("")
      const dealsData = await dealService.getAll()
      setDeals(dealsData)
    } catch (err) {
      setError(err.message || "Failed to load deals")
    } finally {
      setLoading(false)
    }
  }
  
  const handleDealSave = (savedDeal) => {
    setDeals(prev => {
      const existing = prev.find(d => d.Id === savedDeal.Id)
      if (existing) {
        return prev.map(d => d.Id === savedDeal.Id ? savedDeal : d)
      } else {
        return [...prev, savedDeal]
      }
    })
    setShowForm(false)
  }
  
const calculateMetrics = () => {
    const totalDeals = deals.length
    const activeDeals = deals.filter(deal => 
      !["Closed Won", "Closed Lost"].includes(deal.stage_c || deal.stage)
    ).length
    const wonDeals = deals.filter(deal => (deal.stage_c || deal.stage) === "Closed Won").length
    const totalValue = deals.reduce((sum, deal) => sum + (deal.value_c || deal.value || 0), 0)
    const pipelineValue = deals
      .filter(deal => !["Closed Won", "Closed Lost"].includes(deal.stage_c || deal.stage))
      .reduce((sum, deal) => sum + (deal.value_c || deal.value || 0), 0)
    
    const winRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0
    
    return {
      totalDeals,
      activeDeals,
      wonDeals,
      totalValue,
      pipelineValue,
      winRate
    }
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
  if (error) return <ErrorView message={error} onRetry={loadDeals} />
  
  if (showForm) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Create New Deal"
          subtitle="Add a new opportunity to your sales pipeline."
          onMenuClick={onMenuClick}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <DealForm
                onSave={handleDealSave}
                onCancel={() => setShowForm(false)}
              />
            </Card>
          </div>
        </div>
      </div>
    )
  }
  
  const metrics = calculateMetrics()
  
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Sales Pipeline"
        subtitle="Manage your deals through each stage of the sales process."
        actionLabel="Create Deal"
        actionIcon="Plus"
        onAction={() => setShowForm(true)}
        onMenuClick={onMenuClick}
      />
      
      <div className="flex-1 p-6 overflow-hidden">
        <div className="space-y-6 h-full">
          {/* Pipeline Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <p className="text-12 font-medium text-slate-600">Total Deals</p>
                <p className="text-24 font-bold text-slate-900">{metrics.totalDeals}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <p className="text-12 font-medium text-slate-600">Active Pipeline</p>
                <p className="text-24 font-bold text-blue-600">{metrics.activeDeals}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <p className="text-12 font-medium text-slate-600">Won Deals</p>
                <p className="text-24 font-bold text-green-600">{metrics.wonDeals}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <p className="text-12 font-medium text-slate-600">Pipeline Value</p>
                <p className="text-20 font-bold text-purple-600">{formatCurrency(metrics.pipelineValue)}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <p className="text-12 font-medium text-slate-600">Total Value</p>
                <p className="text-20 font-bold text-slate-900">{formatCurrency(metrics.totalValue)}</p>
              </div>
            </Card>
          </div>
          
          {/* Pipeline Board */}
          <Card className="flex-1 p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-20 font-semibold text-slate-900">Deal Pipeline</h2>
              <div className="flex items-center space-x-2 text-12 text-slate-500">
                <span>💡 Drag deals between stages to update them</span>
              </div>
            </div>
            
            <PipelineBoard />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Deals