import React, { useState, useEffect } from "react"
import { useParams, useNavigate, useOutletContext } from "react-router-dom"
import Header from "@/components/organisms/Header"
import ActivityItem from "@/components/molecules/ActivityItem"
import DealCard from "@/components/molecules/DealCard"
import ContactForm from "@/components/organisms/ContactForm"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { contactService } from "@/services/api/contactService"
import { dealService } from "@/services/api/dealService"
import { activityService } from "@/services/api/activityService"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const ContactDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { onMenuClick } = useOutletContext()
  
  const [contact, setContact] = useState(null)
  const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("info")
  const [editMode, setEditMode] = useState(false)
  
  const tabs = [
    { id: "info", label: "Contact Info", icon: "User" },
    { id: "activity", label: "Activity Timeline", icon: "Clock" },
    { id: "deals", label: "Deals", icon: "Handshake" },
    { id: "notes", label: "Notes", icon: "FileText" }
  ]
  
  useEffect(() => {
    loadContactData()
  }, [id])
  
  const loadContactData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [contactData, contactDeals, contactActivities] = await Promise.all([
        contactService.getById(id),
        dealService.getByContactId(id),
        activityService.getByContactId(id)
      ])
      
      setContact(contactData)
      setDeals(contactDeals)
      setActivities(contactActivities)
    } catch (err) {
      setError(err.message || "Failed to load contact details")
    } finally {
      setLoading(false)
    }
  }
  
  const handleContactSave = (savedContact) => {
    setContact(savedContact)
    setEditMode(false)
    toast.success("Contact updated successfully")
  }
  
  const handleDeleteContact = async () => {
    if (!window.confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
      return
    }
    
    try {
      await contactService.delete(id)
      toast.success("Contact deleted successfully")
      navigate("/contacts")
    } catch (error) {
      toast.error("Failed to delete contact")
    }
  }
  
  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }
  
  const formatCurrency = (value, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0
    }).format(value)
  }
  
  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadContactData} />
  if (!contact) return <ErrorView title="Contact not found" message="The contact you're looking for doesn't exist." />
  
  if (editMode) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Edit Contact"
          subtitle={`Updating ${contact.name}`}
          onMenuClick={onMenuClick}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <ContactForm
                contact={contact}
                onSave={handleContactSave}
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
        title={contact.name}
        subtitle={`${contact.title} at ${contact.company}`}
        actionLabel="Edit Contact"
        actionIcon="Edit"
        onAction={() => setEditMode(true)}
        onMenuClick={onMenuClick}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Contact Summary Sidebar */}
          <div className="w-80 border-r border-slate-200 bg-white p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Avatar and Basic Info */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-24 mx-auto mb-4">
                  {getInitials(contact.name)}
                </div>
                <h2 className="text-20 font-bold text-slate-900">{contact.name}</h2>
                <p className="text-14 text-slate-600">{contact.title}</p>
                <p className="text-14 font-medium text-slate-900">{contact.company}</p>
              </div>
              
              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-center text-14 text-slate-600">
                  <ApperIcon name="Mail" className="w-4 h-4 mr-3" />
                  <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center text-14 text-slate-600">
                  <ApperIcon name="Phone" className="w-4 h-4 mr-3" />
                  <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center text-14 text-slate-600">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-3" />
                  Created {format(new Date(contact.createdAt), "MMM d, yyyy")}
                </div>
                <div className="flex items-center text-14 text-slate-600">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-3" />
                  Last contact {format(new Date(contact.lastContactDate), "MMM d, yyyy")}
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <h3 className="text-14 font-semibold text-slate-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map(tag => (
                    <Badge key={tag} variant="primary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-2">
                <h3 className="text-14 font-semibold text-slate-900 mb-3">Quick Actions</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="Mail"
                  onClick={() => window.open(`mailto:${contact.email}`)}
                  className="w-full justify-start"
                >
                  Send Email
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="Phone"
                  onClick={() => window.open(`tel:${contact.phone}`)}
                  className="w-full justify-start"
                >
                  Call Contact
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  icon="Plus"
                  onClick={() => navigate("/deals")}
                  className="w-full justify-start"
                >
                  Create Deal
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon="Trash2"
                  onClick={handleDeleteContact}
                  className="w-full justify-start"
                >
                  Delete Contact
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
              {activeTab === "info" && (
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-14 font-medium text-slate-700 mb-1">Full Name</label>
                      <p className="text-16 text-slate-900">{contact.name}</p>
                    </div>
                    <div>
                      <label className="block text-14 font-medium text-slate-700 mb-1">Email</label>
                      <p className="text-16 text-slate-900">{contact.email}</p>
                    </div>
                    <div>
                      <label className="block text-14 font-medium text-slate-700 mb-1">Phone</label>
                      <p className="text-16 text-slate-900">{contact.phone}</p>
                    </div>
                    <div>
                      <label className="block text-14 font-medium text-slate-700 mb-1">Company</label>
                      <p className="text-16 text-slate-900">{contact.company}</p>
                    </div>
                    <div>
                      <label className="block text-14 font-medium text-slate-700 mb-1">Job Title</label>
                      <p className="text-16 text-slate-900">{contact.title}</p>
                    </div>
                    <div>
                      <label className="block text-14 font-medium text-slate-700 mb-1">Industry</label>
                      <p className="text-16 text-slate-900">{contact.customFields?.industry || "Not specified"}</p>
                    </div>
                  </div>
                  {contact.notes && (
                    <div className="mt-6">
                      <label className="block text-14 font-medium text-slate-700 mb-1">Notes</label>
                      <p className="text-16 text-slate-900 bg-slate-50 p-4 rounded-lg">{contact.notes}</p>
                    </div>
                  )}
                </Card>
              )}
              
              {activeTab === "activity" && (
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">Activity Timeline</h3>
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
                      <p className="text-slate-500">No activity recorded yet</p>
                    </div>
                  )}
                </Card>
              )}
              
              {activeTab === "deals" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-20 font-semibold text-slate-900">Associated Deals</h3>
                    <Button
                      variant="primary"
                      icon="Plus"
                      onClick={() => navigate("/deals")}
                    >
                      Create Deal
                    </Button>
                  </div>
                  
                  {deals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {deals.map(deal => (
                        <DealCard
                          key={deal.Id}
                          deal={deal}
                          contact={contact}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <ApperIcon name="Handshake" className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">No deals associated with this contact</p>
                      <Button
                        variant="primary"
                        icon="Plus"
                        onClick={() => navigate("/deals")}
                      >
                        Create First Deal
                      </Button>
                    </Card>
                  )}
                  
                  {deals.length > 0 && (
                    <Card className="p-6">
                      <h4 className="text-16 font-semibold text-slate-900 mb-4">Deal Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-14 text-slate-600">Total Deals</p>
                          <p className="text-24 font-bold text-slate-900">{deals.length}</p>
                        </div>
                        <div>
                          <p className="text-14 text-slate-600">Total Value</p>
                          <p className="text-24 font-bold text-slate-900">
                            {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-14 text-slate-600">Won Deals</p>
                          <p className="text-24 font-bold text-green-600">
                            {deals.filter(deal => deal.stage === "Closed Won").length}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}
              
              {activeTab === "notes" && (
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">Notes</h3>
                  {contact.notes ? (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-16 text-slate-900 whitespace-pre-wrap">{contact.notes}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ApperIcon name="FileText" className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">No notes added yet</p>
                      <Button
                        variant="primary"
                        icon="Edit"
                        onClick={() => setEditMode(true)}
                      >
                        Add Notes
                      </Button>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactDetail