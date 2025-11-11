import React, { useState, useEffect } from "react"
import { useOutletContext, useNavigate } from "react-router-dom"
import Header from "@/components/organisms/Header"
import ContactCard from "@/components/molecules/ContactCard"
import ContactForm from "@/components/organisms/ContactForm"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import { contactService } from "@/services/api/contactService"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"

const Contacts = () => {
  const { onMenuClick } = useOutletContext()
  const navigate = useNavigate()
  
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [viewMode, setViewMode] = useState("grid") // grid or list
  
  useEffect(() => {
    loadContacts()
  }, [])
  
  useEffect(() => {
    filterContacts()
  }, [contacts, searchTerm, selectedTags])
  
  const loadContacts = async () => {
    try {
      setLoading(true)
      setError("")
      const contactsData = await contactService.getAll()
      setContacts(contactsData)
    } catch (err) {
      setError(err.message || "Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }
  
  const filterContacts = () => {
    let filtered = [...contacts]
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.company.toLowerCase().includes(term) ||
        contact.title.toLowerCase().includes(term) ||
        contact.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }
    
    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(contact =>
        selectedTags.every(tag => contact.tags.includes(tag))
      )
    }
    
    setFilteredContacts(filtered)
  }
  
  const getAllTags = () => {
    const allTags = contacts.reduce((tags, contact) => {
      return [...tags, ...contact.tags]
    }, [])
    return [...new Set(allTags)]
  }
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }
  
  const handleSearchClear = () => {
    setSearchTerm("")
  }
  
  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }
  
  const handleContactSave = (savedContact) => {
    setContacts(prev => {
      const existing = prev.find(c => c.Id === savedContact.Id)
      if (existing) {
        return prev.map(c => c.Id === savedContact.Id ? savedContact : c)
      } else {
        return [...prev, savedContact]
      }
    })
    setShowForm(false)
  }
  
  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }
  
  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadContacts} />
  
  if (showForm) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Add New Contact"
          subtitle="Create a new contact to start building your relationship."
          onMenuClick={onMenuClick}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <ContactForm
                onSave={handleContactSave}
                onCancel={() => setShowForm(false)}
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
        title="Contacts"
        subtitle={`${filteredContacts.length} of ${contacts.length} contacts`}
        showSearch
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        actionLabel="Add Contact"
        actionIcon="UserPlus"
        onAction={() => setShowForm(true)}
        onMenuClick={onMenuClick}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Filters Sidebar */}
          <div className="w-64 border-r border-slate-200 bg-white p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-14 font-semibold text-slate-900 mb-3">View Options</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={viewMode === "grid" ? "primary" : "secondary"}
                    onClick={() => setViewMode("grid")}
                    icon="Grid3X3"
                  >
                    Grid
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "list" ? "primary" : "secondary"}
                    onClick={() => setViewMode("list")}
                    icon="List"
                  >
                    List
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-14 font-semibold text-slate-900 mb-3">Filter by Tags</h3>
                <div className="space-y-2">
                  {getAllTags().map(tag => (
                    <label key={tag} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="rounded border-slate-300 text-primary focus:ring-primary mr-2"
                      />
                      <Badge variant="default" size="sm">
                        {tag}
                      </Badge>
                    </label>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    className="mt-3 text-12"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
              
              <div>
                <h3 className="text-14 font-semibold text-slate-900 mb-3">Quick Stats</h3>
                <div className="space-y-2 text-12 text-slate-600">
                  <div className="flex justify-between">
                    <span>Total Contacts</span>
                    <span className="font-medium">{contacts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Filtered</span>
                    <span className="font-medium">{filteredContacts.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {filteredContacts.length === 0 && !loading ? (
              <Empty
                title={searchTerm || selectedTags.length > 0 ? "No contacts match your filters" : "No contacts yet"}
                message={
                  searchTerm || selectedTags.length > 0
                    ? "Try adjusting your search terms or filters to find what you're looking for."
                    : "Start building your network by adding your first contact."
                }
                actionLabel="Add Contact"
                onAction={() => setShowForm(true)}
                icon="Users"
              />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredContacts.map(contact => (
                  <ContactCard key={contact.Id} contact={contact} />
                ))}
              </div>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-200">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-slate-900">Contact</th>
                        <th className="text-left py-4 px-6 font-medium text-slate-900">Company</th>
                        <th className="text-left py-4 px-6 font-medium text-slate-900">Tags</th>
                        <th className="text-left py-4 px-6 font-medium text-slate-900">Last Contact</th>
                        <th className="text-right py-4 px-6 font-medium text-slate-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map(contact => (
                        <tr key={contact.Id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-12">
                                {getInitials(contact.name)}
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">{contact.name}</div>
                                <div className="text-14 text-slate-600">{contact.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-medium text-slate-900">{contact.company}</div>
                            <div className="text-14 text-slate-600">{contact.title}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1">
                              {contact.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="primary" size="sm">
                                  {tag}
                                </Badge>
                              ))}
                              {contact.tags.length > 2 && (
                                <Badge variant="default" size="sm">
                                  +{contact.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-14 text-slate-600">
                            {new Date(contact.lastContactDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/contacts/${contact.Id}`)}
                              icon="Eye"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contacts