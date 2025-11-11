import React from "react"
import { useNavigate } from "react-router-dom"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const ContactCard = ({ contact }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate(`/contacts/${contact.Id}`)
  }
  
  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }
  
  return (
    <Card className="p-6 cursor-pointer" hover onClick={handleClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-14">
            {getInitials(contact.name)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{contact.name}</h3>
            <p className="text-14 text-slate-600">{contact.title}</p>
          </div>
        </div>
        <ApperIcon name="ChevronRight" className="w-4 h-4 text-slate-400" />
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-14 text-slate-600">
          <ApperIcon name="Building2" className="w-4 h-4 mr-2" />
          {contact.company}
        </div>
        <div className="flex items-center text-14 text-slate-600">
          <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
          {contact.email}
        </div>
        <div className="flex items-center text-14 text-slate-600">
          <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
          {contact.phone}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {contact.tags.slice(0, 3).map(tag => (
          <Badge key={tag} variant="primary" size="sm">
            {tag}
          </Badge>
        ))}
        {contact.tags.length > 3 && (
          <Badge variant="default" size="sm">
            +{contact.tags.length - 3} more
          </Badge>
        )}
      </div>
      
      <div className="text-12 text-slate-500 border-t border-slate-100 pt-3">
        Last contact: {format(new Date(contact.lastContactDate), "MMM d, yyyy")}
      </div>
    </Card>
  )
}

export default ContactCard