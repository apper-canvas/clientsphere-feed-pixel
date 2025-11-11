import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import TextArea from "@/components/atoms/TextArea"
import { dealService } from "@/services/api/dealService"
import { contactService } from "@/services/api/contactService"
import { toast } from "react-toastify"

const DealForm = ({ deal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    contactId: deal?.contactId || "",
    title: deal?.title || "",
    value: deal?.value || "",
    currency: deal?.currency || "USD",
    stage: deal?.stage || "Lead",
    probability: deal?.probability || 25,
    expectedCloseDate: deal?.expectedCloseDate ? deal.expectedCloseDate.split("T")[0] : "",
    notes: deal?.notes || ""
  })
  
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState([])
  const [errors, setErrors] = useState({})
  
  const stages = [
    { value: "Lead", label: "Lead", probability: 25 },
    { value: "Qualified", label: "Qualified", probability: 50 },
    { value: "Proposal", label: "Proposal", probability: 65 },
    { value: "Negotiation", label: "Negotiation", probability: 80 },
    { value: "Closed Won", label: "Closed Won", probability: 100 },
    { value: "Closed Lost", label: "Closed Lost", probability: 0 }
  ]
  
  useEffect(() => {
    loadContacts()
  }, [])
  
  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll()
      setContacts(contactsData)
    } catch (error) {
      toast.error("Failed to load contacts")
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.contactId) {
      newErrors.contactId = "Contact is required"
    }
    
    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required"
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Deal value must be greater than 0"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting")
      return
    }
    
    setLoading(true)
    
    try {
      const dealData = {
        ...formData,
        contactId: parseInt(formData.contactId),
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate).toISOString() : null
      }
      
      let savedDeal
      if (deal?.Id) {
        savedDeal = await dealService.update(deal.Id, dealData)
        toast.success("Deal updated successfully")
      } else {
        savedDeal = await dealService.create(dealData)
        toast.success("Deal created successfully")
      }
      
      onSave(savedDeal)
    } catch (error) {
      toast.error(error.message || "Failed to save deal")
    } finally {
      setLoading(false)
    }
  }
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }
  
  const handleStageChange = (stage) => {
    const stageData = stages.find(s => s.value === stage)
    setFormData(prev => ({
      ...prev,
      stage,
      probability: stageData?.probability || prev.probability
    }))
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Contact"
          required
          value={formData.contactId}
          onChange={(e) => handleChange("contactId", e.target.value)}
          error={errors.contactId}
        >
          <option value="">Select a contact</option>
          {contacts.map(contact => (
            <option key={contact.Id} value={contact.Id}>
              {contact.name} - {contact.company}
            </option>
          ))}
        </Select>
        
        <Input
          label="Deal Title"
          required
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          placeholder="Enterprise License Deal"
        />
        
        <Input
          label="Deal Value"
          type="number"
          required
          value={formData.value}
          onChange={(e) => handleChange("value", e.target.value)}
          error={errors.value}
          placeholder="50000"
        />
        
        <Select
          label="Currency"
          value={formData.currency}
          onChange={(e) => handleChange("currency", e.target.value)}
        >
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="CAD">CAD - Canadian Dollar</option>
        </Select>
        
        <Select
          label="Stage"
          value={formData.stage}
          onChange={(e) => handleStageChange(e.target.value)}
        >
          {stages.map(stage => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </Select>
        
        <Input
          label="Probability (%)"
          type="number"
          min="0"
          max="100"
          value={formData.probability}
          onChange={(e) => handleChange("probability", e.target.value)}
          placeholder="75"
        />
        
        <Input
          label="Expected Close Date"
          type="date"
          value={formData.expectedCloseDate}
          onChange={(e) => handleChange("expectedCloseDate", e.target.value)}
        />
      </div>
      
      <TextArea
        label="Notes"
        rows={4}
        value={formData.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        placeholder="Additional notes about this deal..."
      />
      
      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {deal?.Id ? "Update Deal" : "Create Deal"}
        </Button>
      </div>
    </form>
  )
}

export default DealForm