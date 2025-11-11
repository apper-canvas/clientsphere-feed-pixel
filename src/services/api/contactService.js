import contactsData from "@/services/mockData/contacts.json"

let contacts = [...contactsData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const contactService = {
  async getAll() {
    await delay()
    return [...contacts]
  },

  async getById(id) {
    await delay()
    const contact = contacts.find(c => c.Id === parseInt(id))
    if (!contact) {
      throw new Error("Contact not found")
    }
    return { ...contact }
  },

  async create(contactData) {
    await delay()
    const maxId = Math.max(...contacts.map(c => c.Id), 0)
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      lastContactDate: new Date().toISOString()
    }
    contacts.push(newContact)
    return { ...newContact }
  },

  async update(id, contactData) {
    await delay()
    const index = contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Contact not found")
    }
    const updatedContact = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id)
    }
    contacts[index] = updatedContact
    return { ...updatedContact }
  },

  async delete(id) {
    await delay()
    const index = contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Contact not found")
    }
    const deletedContact = contacts[index]
    contacts.splice(index, 1)
    return { ...deletedContact }
  },

  async search(query) {
    await delay()
    const searchTerm = query.toLowerCase()
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.company.toLowerCase().includes(searchTerm) ||
      contact.title.toLowerCase().includes(searchTerm) ||
      contact.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
}