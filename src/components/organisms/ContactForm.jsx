import React, { useState } from "react";
import ApperFileFieldComponent from "@/components/atoms/FileUploader/ApperFileFieldComponent";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { contactService } from "@/services/api/contactService";
function ContactForm({ contact, onSubmit, onCancel, submitLabel = "Save Contact" }) {
const [formData, setFormData] = useState({
    name: contact?.name_c || contact?.name || "",
    email: contact?.email_c || contact?.email || "",
    phone: contact?.phone_c || contact?.phone || "",
    company: contact?.company_c || contact?.company || "",
    title: contact?.title_c || contact?.title || "",
    tags: (contact?.tags_c ? contact.tags_c.split(',') : contact?.tags || []).join(", "),
    notes: contact?.notes_c || contact?.notes || ""
  })

  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company is required"
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
// Get files from ApperFileFieldComponent
      let files = [];
      try {
        if (window.ApperSDK && window.ApperSDK.ApperFileUploader) {
          const { ApperFileUploader } = window.ApperSDK;
          files = await ApperFileUploader.FileField.getFiles('file_c');
        }
      } catch (error) {
        console.warn('Could not retrieve files from file field:', error);
        files = uploadedFiles; // Fallback to state
      }

      const contactData = {
        name_c: formData.name,
        email_c: formData.email,
        phone_c: formData.phone,
        company_c: formData.company,
        title_c: formData.title,
        notes_c: formData.notes,
        tags_c: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag).join(','),
        ...(files && files.length > 0 && { file_c: files })
      }
let savedContact
      if (contact?.Id) {
        savedContact = await contactService.update(contact.Id, contactData)
        toast.success("Contact updated successfully")
      } else {
        savedContact = await contactService.create(contactData)
        toast.success("Contact created successfully")
      }
      
      onSubmit(savedContact)
    } catch (error) {
      toast.error(error.message || "Failed to save contact")
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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          required
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          placeholder="John Doe"
        />
        
        <Input
          label="Email Address"
          type="email"
          required
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          placeholder="john@company.com"
        />
        
        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
          placeholder="(555) 123-4567"
        />
        
        <Input
          label="Company"
          required
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
          error={errors.company}
          placeholder="Acme Corporation"
        />
        
        <Input
          label="Job Title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          placeholder="VP of Sales"
        />
        
<Input
          label="Tags"
          value={formData.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
          error={errors.tags}
          placeholder="enterprise, hot-lead, decision-maker"
        />
      </div>

      <div>
        <label className="block text-14 font-medium text-gray-700 mb-2">
          Attachments
        </label>
        <ApperFileFieldComponent
          elementId="file_c"
          config={{
            fieldKey: 'file_c',
            fieldName: 'file_c',
            tableName: 'contacts_c',
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
            existingFiles: contact?.file_c || [],
            fileCount: contact?.file_c?.length || 0
          }}
        />
      </div>
      
      <TextArea
        label="Notes"
        rows={4}
        value={formData.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        error={errors.notes}
        placeholder="Additional notes about this contact..."
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
          {contact?.Id ? "Update Contact" : "Create Contact"}
        </Button>
      </div>
    </form>
  )
}

export default ContactForm