import React, { useState, useEffect } from "react"
import { useParams, useNavigate, useOutletContext } from "react-router-dom"
import Header from "@/components/organisms/Header"
import ActivityItem from "@/components/molecules/ActivityItem"
import DealForm from "@/components/organisms/DealForm"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { dealService } from "@/services/api/dealService"
import { contactService } from "@/services/api/contactService"
import { activityService } from "@/services/api/activityService"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import { format, differenceInDays } from "date-fns"

const DealDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { onMenuClick } = useOutletContext()
  
  const [deal, setDeal] = useState(null)
  const [contact, setContact] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [editMode, setEditMode] = useState(false)
  
  const tabs = [
    { id: "overview", label: "Overview", icon: "Eye" },
    { id: "activity", label: "Activity", icon: "Clock" },
    { id: "timeline", label: "Timeline", icon: "GitBranch" }
  ]
  
  useEffect(() => {
    loadDealData()
  }, [id])
  
  const loadDealData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const dealData = await dealService.getById(id)
      const [contactData, dealActivities] = await Promise.all([
        contactService.getById(dealData.contactId),
        activityService.getByDealId(id)
      ])
      
      setDeal(dealData)
      setContact(contactData)
      setActivities(dealActivities)
    } catch (err) {
      setError(err.message || "Failed to load deal details")
    } finally {
      setLoading(false)
    }
  }
  
  const handleDealSave = (savedDeal) => {
    setDeal(savedDeal)
    setEditMode(false)
    toast.success("Deal updated successfully")
  }
  
  const handleDeleteDeal = async () => {
    if (!window.confirm("Are you sure you want to delete this deal? This action cannot be undone.")) {
      return
    }
    
    try {
      await dealService.delete(id)
      toast.success("Deal deleted successfully")
      navigate("/deals")
    } catch (error) {
      toast.error("Failed to delete deal")
    }
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
  
  const getDaysInStage = () => {
    return differenceInDays(new Date(), new Date(deal.stageChangedAt))
  }
  
  const formatCurrency = (value, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0
    }).format(value)
  }
  
  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadDealData} />
  if (!deal) return <ErrorView title="Deal not found" message="The deal you're looking for doesn't exist." />
  
  if (editMode) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Edit Deal"
          subtitle={`Updating ${deal.title}`}
          onMenuClick={onMenuClick}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <DealForm
                deal={deal}
                onSave={handleDealSave}
                onCancel={() => setEditMode(false)}
              />
            </Card>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col h-full">
      <Header
        title={deal.title}
        subtitle={`${contact?.name} • ${contact?.company}`}
        actionLabel="Edit Deal"
        actionIcon="Edit"
        onAction={() => setEditMode(true)}
        onMenuClick={onMenuClick}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Deal Summary Sidebar */}
          <div className="w-80 border-r border-slate-200 bg-white p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Deal Value */}
              <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-xl">
                <div className="text-32 font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
                  {formatCurrency(deal.value, deal.currency)}
                </div>
                <Badge variant={getStageColor(deal.stage)} size="lg">
                  {deal.stage}
                </Badge>
              </div>
              
              {/* Deal Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-24 font-bold text-slate-900">{deal.probability}%</p>
                  <p className="text-12 text-slate-600">Probability</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-24 font-bold text-slate-900">{getDaysInStage()}</p>
                  <p className="text-12 text-slate-600">Days in Stage</p>
                </div>
              </div>
              
              {/* Key Dates */}
              <div className="space-y-3">
                <h3 className="text-14 font-semibold text-slate-900">Key Dates</h3>
                <div className="space-y-2 text-12 text-slate-600">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">{format(new Date(deal.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stage Changed:</span>
                    <span className="font-medium">{format(new Date(deal.stageChangedAt), "MMM d, yyyy")}</span>
                  </div>
                  {deal.expectedCloseDate && (
                    <div className="flex justify-between">
                      <span>Expected Close:</span>
                      <span className="font-medium">{format(new Date(deal.expectedCloseDate), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Contact Info */}
              {contact && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="text-14 font-semibold text-slate-900 mb-3">Primary Contact</h3>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-900">{contact.name}</p>
                    <p className="text-14 text-slate-600">{contact.title}</p>
                    <p className="text-14 text-slate-600">{contact.company}</p>
                    <div className="flex space-x-2 mt-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="Mail"
                        onClick={() => window.open(`mailto:${contact.email}`)}
                      >
                        Email
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="User"
                        onClick={() => navigate(`/contacts/${contact.Id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="space-y-2">
                <h3 className="text-14 font-semibold text-slate-900 mb-3">Actions</h3>
                <Button
                  variant="success"
                  size="sm"
                  icon="CheckCircle"
                  onClick={() => {/* Handle mark as won */}}
                  className="w-full justify-start"
                >
                  Mark as Won
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  icon="XCircle"
                  onClick={() => {/* Handle mark as lost */}}
                  className="w-full justify-start"
                >
                  Mark as Lost
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon="Trash2"
                  onClick={handleDeleteDeal}
                  className="w-full justify-start"
                >
                  Delete Deal
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-slate-200 bg-white px-6">
              <nav className="flex space-x-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-14 transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ApperIcon name={tab.icon} className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-20 font-semibold text-slate-900 mb-6">Deal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-14 font-medium text-slate-700 mb-1">Deal Title</label>
                        <p className="text-16 text-slate-900">{deal.title}</p>
                      </div>
                      <div>
                        <label className="block text-14 font-medium text-slate-700 mb-1">Value</label>
                        <p className="text-16 text-slate-900">{formatCurrency(deal.value, deal.currency)}</p>
                      </div>
                      <div>
                        <label className="block text-14 font-medium text-slate-700 mb-1">Stage</label>
                        <Badge variant={getStageColor(deal.stage)}>{deal.stage}</Badge>
                      </div>
                      <div>
                        <label className="block text-14 font-medium text-slate-700 mb-1">Probability</label>
                        <p className="text-16 text-slate-900">{deal.probability}%</p>
                      </div>
                      <div>
                        <label className="block text-14 font-medium text-slate-700 mb-1">Currency</label>
                        <p className="text-16 text-slate-900">{deal.currency}</p>
                      </div>
                      <div>
                        <label className="block text-14 font-medium text-slate-700 mb-1">Expected Close</label>
                        <p className="text-16 text-slate-900">
                          {deal.expectedCloseDate ? format(new Date(deal.expectedCloseDate), "MMM d, yyyy") : "Not set"}
                        </p>
                      </div>
                    </div>
                    {deal.notes && (
                      <div className="mt-6">
                        <label className="block text-14 font-medium text-slate-700 mb-1">Notes</label>
                        <p className="text-16 text-slate-900 bg-slate-50 p-4 rounded-lg">{deal.notes}</p>
                      </div>
                    )}
                  </Card>
                </div>
              )}
              
              {activeTab === "activity" && (
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">Deal Activity</h3>
                  {activities.length > 0 ? (
                    <div className="space-y-6">
                      {activities.map((activity, index) => (
                        <ActivityItem
                          key={activity.Id}
                          activity={activity}
                          isLast={index === activities.length - 1}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ApperIcon name="Clock" className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No activity recorded for this deal</p>
                    </div>
                  )}
                </Card>
              )}
              
              {activeTab === "timeline" && (
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">Deal Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">Deal Created</p>
                        <p className="text-14 text-slate-600">{format(new Date(deal.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">Current Stage: {deal.stage}</p>
                        <p className="text-14 text-slate-600">{format(new Date(deal.stageChangedAt), "MMM d, yyyy 'at' h:mm a")}</p>
                      </div>
                    </div>
                    
                    {deal.expectedCloseDate && (
                      <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">Expected Close Date</p>
                          <p className="text-14 text-slate-600">{format(new Date(deal.expectedCloseDate), "MMM d, yyyy")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DealDetail