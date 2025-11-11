import dealsData from "@/services/mockData/deals.json"

let deals = [...dealsData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const dealService = {
  async getAll() {
    await delay()
    return [...deals]
  },

  async getById(id) {
    await delay()
    const deal = deals.find(d => d.Id === parseInt(id))
    if (!deal) {
      throw new Error("Deal not found")
    }
    return { ...deal }
  },

  async getByContactId(contactId) {
    await delay()
    return deals.filter(d => d.contactId === parseInt(contactId))
  },

  async create(dealData) {
    await delay()
    const maxId = Math.max(...deals.map(d => d.Id), 0)
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: new Date().toISOString(),
      stageChangedAt: new Date().toISOString()
    }
    deals.push(newDeal)
    return { ...newDeal }
  },

  async update(id, dealData) {
    await delay()
    const index = deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    const updatedDeal = {
      ...deals[index],
      ...dealData,
      Id: parseInt(id),
      stageChangedAt: new Date().toISOString()
    }
    deals[index] = updatedDeal
    return { ...updatedDeal }
  },

  async delete(id) {
    await delay()
    const index = deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    const deletedDeal = deals[index]
    deals.splice(index, 1)
    return { ...deletedDeal }
  },

  async updateStage(id, newStage) {
    await delay()
    const index = deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    const updatedDeal = {
      ...deals[index],
      stage: newStage,
      stageChangedAt: new Date().toISOString()
    }
    deals[index] = updatedDeal
    return { ...updatedDeal }
  }
}