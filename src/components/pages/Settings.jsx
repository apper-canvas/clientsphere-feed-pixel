import React, { useState } from "react"
import { useOutletContext } from "react-router-dom"
import Header from "@/components/organisms/Header"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"

const Settings = () => {
  const { onMenuClick } = useOutletContext()
  
  const [activeTab, setActiveTab] = useState("profile")
  const [settings, setSettings] = useState({
    companyName: "ClientSphere",
    defaultCurrency: "USD",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    language: "en",
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    dealReminders: true
  })
  
  const tabs = [
    { id: "profile", label: "Company Profile", icon: "Building2" },
    { id: "preferences", label: "Preferences", icon: "Settings" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "integrations", label: "Integrations", icon: "Plug" },
    { id: "security", label: "Security", icon: "Shield" }
  ]
  
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }
  
  const handleSaveSettings = () => {
    // Simulate saving settings
    toast.success("Settings saved successfully")
  }
  
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Settings"
        subtitle="Manage your CRM preferences and configuration."
        onMenuClick={onMenuClick}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Settings Navigation */}
          <div className="w-64 border-r border-slate-200 bg-white p-6 overflow-y-auto">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-14 font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Settings Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "profile" && (
              <div className="space-y-6 max-w-2xl">
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">Company Information</h3>
                  <div className="space-y-4">
                    <Input
                      label="Company Name"
                      value={settings.companyName}
                      onChange={(e) => handleSettingChange("companyName", e.target.value)}
                      placeholder="Enter your company name"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Industry"
                        placeholder="Technology"
                      />
                      <Input
                        label="Company Size"
                        placeholder="1-50 employees"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                      />
                      <Input
                        label="Website"
                        type="url"
                        placeholder="https://company.com"
                      />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">Billing Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-green-900">Pro Plan</p>
                        <p className="text-14 text-green-700">$49/month • Billed annually</p>
                      </div>
                      <Button variant="success" size="sm">
                        Manage Plan
                      </Button>
                    </div>
                    <p className="text-14 text-slate-600">
                      Your next billing date is March 15, 2024. You have unlimited contacts and deals with this plan.
                    </p>
                  </div>
                </Card>
              </div>
            )}
            
            {activeTab === "preferences" && (
              <div className="space-y-6 max-w-2xl">
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">General Preferences</h3>
                  <div className="space-y-4">
                    <Select
                      label="Default Currency"
                      value={settings.defaultCurrency}
                      onChange={(e) => handleSettingChange("defaultCurrency", e.target.value)}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </Select>
                    
                    <Select
                      label="Timezone"
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange("timezone", e.target.value)}
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </Select>
                    
                    <Select
                      label="Date Format"
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange("dateFormat", e.target.value)}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </Select>
                    
                    <Select
                      label="Language"
                      value={settings.language}
                      onChange={(e) => handleSettingChange("language", e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </Select>
                  </div>
                </Card>
              </div>
            )}
            
            {activeTab === "notifications" && (
              <div className="space-y-6 max-w-2xl">
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">Notification Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Email Notifications</h4>
                        <p className="text-14 text-slate-600">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Push Notifications</h4>
                        <p className="text-14 text-slate-600">Receive push notifications in browser</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.pushNotifications}
                          onChange={(e) => handleSettingChange("pushNotifications", e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Weekly Reports</h4>
                        <p className="text-14 text-slate-600">Get weekly performance summaries</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.weeklyReports}
                          onChange={(e) => handleSettingChange("weeklyReports", e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Deal Reminders</h4>
                        <p className="text-14 text-slate-600">Reminders for deal follow-ups</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.dealReminders}
                          onChange={(e) => handleSettingChange("dealReminders", e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            {activeTab === "integrations" && (
              <div className="space-y-6 max-w-2xl">
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">Available Integrations</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Gmail", icon: "Mail", status: "connected", description: "Sync emails and calendar events" },
                      { name: "Slack", icon: "MessageSquare", status: "available", description: "Get notifications in Slack channels" },
                      { name: "Mailchimp", icon: "Send", status: "available", description: "Sync contacts for email marketing" },
                      { name: "Zapier", icon: "Zap", status: "connected", description: "Connect with 3000+ apps" }
                    ].map(integration => (
                      <div key={integration.name} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <ApperIcon name={integration.icon} className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{integration.name}</h4>
                            <p className="text-14 text-slate-600">{integration.description}</p>
                          </div>
                        </div>
                        <Button
                          variant={integration.status === "connected" ? "success" : "primary"}
                          size="sm"
                        >
                          {integration.status === "connected" ? "Connected" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
            
            {activeTab === "security" && (
              <div className="space-y-6 max-w-2xl">
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">Security Settings</h3>
                  <div className="space-y-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium text-green-900">Account Security: Strong</h4>
                      </div>
                      <p className="text-14 text-green-700">Your account is protected with industry-standard security measures.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                          <p className="text-14 text-slate-600">Add an extra layer of security to your account</p>
                        </div>
                        <Button variant="primary" size="sm">
                          Enable 2FA
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900">Password</h4>
                          <p className="text-14 text-slate-600">Last changed 30 days ago</p>
                        </div>
                        <Button variant="secondary" size="sm">
                          Change Password
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900">Active Sessions</h4>
                          <p className="text-14 text-slate-600">Manage your active login sessions</p>
                        </div>
                        <Button variant="secondary" size="sm">
                          View Sessions
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-20 font-semibold text-slate-900 mb-6">Data & Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Export Data</h4>
                        <p className="text-14 text-slate-600">Download all your CRM data</p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Delete Account</h4>
                        <p className="text-14 text-slate-600">Permanently delete your account and data</p>
                      </div>
                      <Button variant="danger" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-slate-200 max-w-2xl">
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                icon="Save"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings