import React, { useState, useEffect } from "react"
import { useOutletContext, useNavigate } from "react-router-dom"
import Header from "@/components/organisms/Header"
import MetricCard from "@/components/molecules/MetricCard"
import ActivityItem from "@/components/molecules/ActivityItem"
import DealCard from "@/components/molecules/DealCard"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { contactService } from "@/services/api/contactService"
import { dealService } from "@/services/api/dealService"
import { activityService } from "@/services/api/activityService"
import { toast } from "react-toastify"

const Dashboard = () => {
  const { onMenuClick } = useOutletContext()
  const navigate = useNavigate()
  
const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [weatherLoading, setWeatherLoading] = useState(false)
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ])
      
      setContacts(contactsData)
      setDeals(dealsData)
      setActivities(activitiesData.slice(0, 5)) // Latest 5 activities
    } catch (err) {
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }
  
  const getMetrics = () => {
    const totalContacts = contacts.length
    const activeDeals = deals.filter(deal => 
      !["Closed Won", "Closed Lost"].includes(deal.stage)
    ).length
    const pipelineValue = deals
      .filter(deal => !["Closed Won", "Closed Lost"].includes(deal.stage))
      .reduce((sum, deal) => sum + deal.value, 0)
    const closedWonDeals = deals.filter(deal => deal.stage === "Closed Won")
    const conversionRate = deals.length > 0 
      ? Math.round((closedWonDeals.length / deals.length) * 100) 
      : 0
    
    return {
      totalContacts,
      activeDeals,
      pipelineValue,
      conversionRate
    }
  }
  
  const getUpcomingDeals = () => {
    return deals
      .filter(deal => deal.expectedCloseDate && !["Closed Won", "Closed Lost"].includes(deal.stage))
      .sort((a, b) => new Date(a.expectedCloseDate) - new Date(b.expectedCloseDate))
      .slice(0, 3)
  }
  
  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId)
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
}

  const handleGetWeather = async () => {
    setWeatherLoading(true)
    try {
      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Get user's location
      const getLocation = () => {
        return new Promise((resolve) => {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  lat: position.coords.latitude,
                  lon: position.coords.longitude
                })
              },
              () => {
                // Fallback to London coordinates
                resolve({ lat: 51.5074, lon: -0.1278 })
              },
              { timeout: 5000 }
            )
          } else {
            // Fallback to London coordinates
            resolve({ lat: 51.5074, lon: -0.1278 })
          }
        })
      }

      const location = await getLocation()
      
      const result = await apperClient.functions.invoke(import.meta.env.VITE_GET_WEATHER, {
        body: JSON.stringify(location),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (result.success) {
        const weather = result.data
        toast.success('get weather success', {autoClose: 8000})
        // toast.success(
        //   `Weather: ${weather.temperature}°C, ${weather.description}. Humidity: ${weather.humidity}%, Wind: ${weather.windSpeed} m/s`,
        //   { autoClose: 8000 }
        // )
      } else {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_GET_WEATHER}. The response body is: ${JSON.stringify(result)}.`)
        toast.error(result.message || "Failed to fetch weather data")
      }
    } catch (error) {
      console.info(`apper_info: Got this error an this function: ${import.meta.env.VITE_GET_WEATHER}. The error is: ${error.message}`)
      toast.error("Unable to fetch weather. Please try again.")
    } finally {
      setWeatherLoading(false)
    }
  }
  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadDashboardData} />
  
  const metrics = getMetrics()
  const upcomingDeals = getUpcomingDeals()
  
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your sales pipeline."
        actionLabel="Quick Add"
        actionIcon="Plus"
        onAction={() => navigate("/contacts")}
        onMenuClick={onMenuClick}
      />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Contacts"
              value={metrics.totalContacts.toLocaleString()}
              icon="Users"
              trend="up"
              trendValue="+12%"
              color="blue"
            />
            <MetricCard
              title="Active Deals"
              value={metrics.activeDeals.toLocaleString()}
              icon="Handshake"
              trend="up"
              trendValue="+8%"
              color="purple"
            />
            <MetricCard
              title="Pipeline Value"
              value={formatCurrency(metrics.pipelineValue)}
              icon="DollarSign"
              trend="up"
              trendValue="+23%"
              color="green"
            />
            <MetricCard
              title="Conversion Rate"
              value={`${metrics.conversionRate}%`}
              icon="TrendingUp"
              trend="up"
              trendValue="+5%"
              color="yellow"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-20 font-semibold text-slate-900">Recent Activities</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/contacts")}
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <ActivityItem
                      key={activity.Id}
                      activity={activity}
                      isLast={index === activities.length - 1}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No recent activities</p>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Upcoming Deals */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-20 font-semibold text-slate-900">Upcoming Deals</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/deals")}
                >
                  View Pipeline
                </Button>
              </div>
              
              <div className="space-y-4">
                {upcomingDeals.length > 0 ? (
                  upcomingDeals.map(deal => (
                    <DealCard
                      key={deal.Id}
                      deal={deal}
                      contact={getContactById(deal.contactId)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No upcoming deals</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Quick Actions */}
<Card className="p-6">
            <h2 className="text-20 font-semibold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="primary"
                size="lg"
                icon="UserPlus"
                onClick={() => navigate("/contacts")}
                className="justify-start"
              >
                Add New Contact
              </Button>
              <Button
                variant="success"
                size="lg"
                icon="Plus"
                onClick={() => navigate("/deals")}
                className="justify-start"
              >
                Create Deal
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon="BarChart3"
                onClick={() => navigate("/analytics")}
                className="justify-start"
              >
                View Analytics
              </Button>
              <Button
                variant="info"
                size="lg"
                icon="Cloud"
                onClick={handleGetWeather}
                disabled={weatherLoading}
                className="justify-start"
              >
                {weatherLoading ? "Loading..." : "Get Weather"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard