import React, { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import Header from "@/components/organisms/Header"
import MetricCard from "@/components/molecules/MetricCard"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { contactService } from "@/services/api/contactService"
import { dealService } from "@/services/api/dealService"
import { activityService } from "@/services/api/activityService"
import Chart from "react-apexcharts"
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns"

const Analytics = () => {
  const { onMenuClick } = useOutletContext()
  
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    loadAnalyticsData()
  }, [])
  
  const loadAnalyticsData = async () => {
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
      setActivities(activitiesData)
    } catch (err) {
      setError(err.message || "Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }
  
  const getMetrics = () => {
    const totalContacts = contacts.length
    const totalDeals = deals.length
    const wonDeals = deals.filter(deal => deal.stage === "Closed Won")
    const lostDeals = deals.filter(deal => deal.stage === "Closed Lost")
    const activeDeals = deals.filter(deal => !["Closed Won", "Closed Lost"].includes(deal.stage))
    
    const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0)
    const pipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0)
    
    const conversionRate = totalDeals > 0 ? (wonDeals.length / totalDeals) * 100 : 0
    const avgDealValue = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0
    
    return {
      totalContacts,
      totalDeals,
      wonDeals: wonDeals.length,
      lostDeals: lostDeals.length,
      activeDeals: activeDeals.length,
      totalRevenue,
      pipelineValue,
      conversionRate,
      avgDealValue
    }
  }
  
  const getPipelineData = () => {
    const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]
    const stageData = stages.map(stage => {
      const stageDeals = deals.filter(deal => deal.stage === stage)
      return {
        stage,
        count: stageDeals.length,
        value: stageDeals.reduce((sum, deal) => sum + deal.value, 0)
      }
    })
    
    return {
      categories: stageData.map(d => d.stage),
      counts: stageData.map(d => d.count),
      values: stageData.map(d => d.value)
    }
  }
  
  const getMonthlyData = () => {
    const last6Months = eachMonthOfInterval({
      start: startOfMonth(subMonths(new Date(), 5)),
      end: endOfMonth(new Date())
    })
    
    const monthlyData = last6Months.map(month => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      
      const monthContacts = contacts.filter(contact => {
        const createdAt = new Date(contact.createdAt)
        return createdAt >= monthStart && createdAt <= monthEnd
      }).length
      
      const monthDeals = deals.filter(deal => {
        const createdAt = new Date(deal.createdAt)
        return createdAt >= monthStart && createdAt <= monthEnd
      }).length
      
      const monthRevenue = deals.filter(deal => {
        const createdAt = new Date(deal.stageChangedAt)
        return deal.stage === "Closed Won" && createdAt >= monthStart && createdAt <= monthEnd
      }).reduce((sum, deal) => sum + deal.value, 0)
      
      return {
        month: format(month, "MMM"),
        contacts: monthContacts,
        deals: monthDeals,
        revenue: monthRevenue
      }
    })
    
    return {
      categories: monthlyData.map(d => d.month),
      contacts: monthlyData.map(d => d.contacts),
      deals: monthlyData.map(d => d.deals),
      revenue: monthlyData.map(d => d.revenue)
    }
  }
  
  const getActivityData = () => {
    const activityTypes = ["call", "email", "meeting", "note"]
    const activityData = activityTypes.map(type => {
      const typeActivities = activities.filter(activity => activity.type === type)
      return {
        type,
        count: typeActivities.length
      }
    })
    
    return {
      labels: activityData.map(d => d.type.charAt(0).toUpperCase() + d.type.slice(1)),
      series: activityData.map(d => d.count)
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
  if (error) return <ErrorView message={error} onRetry={loadAnalyticsData} />
  
  const metrics = getMetrics()
  const pipelineData = getPipelineData()
  const monthlyData = getMonthlyData()
  const activityData = getActivityData()
  
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Analytics"
        subtitle="Track your sales performance and identify growth opportunities."
        onMenuClick={onMenuClick}
      />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(metrics.totalRevenue)}
              icon="DollarSign"
              trend="up"
              trendValue="+15%"
              color="green"
            />
            <MetricCard
              title="Pipeline Value"
              value={formatCurrency(metrics.pipelineValue)}
              icon="TrendingUp"
              trend="up"
              trendValue="+23%"
              color="blue"
            />
            <MetricCard
              title="Conversion Rate"
              value={`${metrics.conversionRate.toFixed(1)}%`}
              icon="Target"
              trend="up"
              trendValue="+5%"
              color="purple"
            />
            <MetricCard
              title="Avg Deal Value"
              value={formatCurrency(metrics.avgDealValue)}
              icon="BarChart3"
              trend="up"
              trendValue="+12%"
              color="yellow"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline Distribution */}
            <Card className="p-6">
              <h3 className="text-20 font-semibold text-slate-900 mb-6">Pipeline Distribution</h3>
              <Chart
                options={{
                  chart: {
                    type: "bar",
                    toolbar: { show: false }
                  },
                  colors: ["#2563eb"],
                  plotOptions: {
                    bar: {
                      borderRadius: 4,
                      horizontal: false
                    }
                  },
                  dataLabels: { enabled: false },
                  xaxis: {
                    categories: pipelineData.categories
                  },
                  yaxis: {
                    title: { text: "Number of Deals" }
                  },
                  grid: {
                    borderColor: "#e2e8f0",
                    strokeDashArray: 4
                  }
                }}
                series={[{
                  name: "Deals",
                  data: pipelineData.counts
                }]}
                type="bar"
                height={300}
              />
            </Card>
            
            {/* Activity Distribution */}
            <Card className="p-6">
              <h3 className="text-20 font-semibold text-slate-900 mb-6">Activity Distribution</h3>
              <Chart
                options={{
                  chart: {
                    type: "donut"
                  },
                  colors: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"],
                  labels: activityData.labels,
                  plotOptions: {
                    pie: {
                      donut: {
                        size: "65%"
                      }
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: function(val) {
                      return Math.round(val) + "%"
                    }
                  },
                  legend: {
                    position: "bottom"
                  }
                }}
                series={activityData.series}
                type="donut"
                height={300}
              />
            </Card>
          </div>
          
          {/* Monthly Trends */}
          <Card className="p-6">
            <h3 className="text-20 font-semibold text-slate-900 mb-6">6-Month Trends</h3>
            <Chart
              options={{
                chart: {
                  type: "line",
                  toolbar: { show: false }
                },
                colors: ["#2563eb", "#10b981", "#f59e0b"],
                stroke: {
                  curve: "smooth",
                  width: 3
                },
                markers: {
                  size: 5
                },
                xaxis: {
                  categories: monthlyData.categories
                },
                yaxis: [
                  {
                    title: { text: "Count" },
                    seriesName: "Contacts"
                  },
                  {
                    opposite: true,
                    title: { text: "Revenue ($)" },
                    seriesName: "Revenue"
                  }
                ],
                grid: {
                  borderColor: "#e2e8f0",
                  strokeDashArray: 4
                },
                legend: {
                  position: "top"
                }
              }}
              series={[
                {
                  name: "New Contacts",
                  data: monthlyData.contacts
                },
                {
                  name: "New Deals",
                  data: monthlyData.deals
                },
                {
                  name: "Revenue",
                  data: monthlyData.revenue,
                  yAxisIndex: 1
                }
              ]}
              type="line"
              height={350}
            />
          </Card>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-16 font-semibold text-slate-900 mb-4">Deal Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Active Deals:</span>
                  <span className="font-medium text-blue-600">{metrics.activeDeals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Won Deals:</span>
                  <span className="font-medium text-green-600">{metrics.wonDeals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Lost Deals:</span>
                  <span className="font-medium text-red-600">{metrics.lostDeals}</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-16 font-semibold text-slate-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Win Rate:</span>
                  <span className="font-medium text-green-600">{(metrics.wonDeals / (metrics.wonDeals + metrics.lostDeals) * 100 || 0).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Avg Deal Size:</span>
                  <span className="font-medium">{formatCurrency(metrics.avgDealValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Activities:</span>
                  <span className="font-medium">{activities.length}</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-16 font-semibold text-slate-900 mb-4">Growth</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Contacts:</span>
                  <span className="font-medium text-blue-600">{metrics.totalContacts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pipeline Value:</span>
                  <span className="font-medium text-purple-600">{formatCurrency(metrics.pipelineValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Revenue:</span>
                  <span className="font-medium text-green-600">{formatCurrency(metrics.totalRevenue)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics