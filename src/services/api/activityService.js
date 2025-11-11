import activitiesData from "@/services/mockData/activities.json"

let activities = [...activitiesData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const activityService = {
  async getAll() {
    await delay()
    return [...activities]
  },

  async getById(id) {
    await delay()
    const activity = activities.find(a => a.Id === parseInt(id))
    if (!activity) {
      throw new Error("Activity not found")
    }
    return { ...activity }
  },

  async getByContactId(contactId) {
    await delay()
    return activities
      .filter(a => a.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async getByDealId(dealId) {
    await delay()
    return activities
      .filter(a => a.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async create(activityData) {
    await delay()
    const maxId = Math.max(...activities.map(a => a.Id), 0)
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    }
    activities.push(newActivity)
    return { ...newActivity }
  },

  async update(id, activityData) {
    await delay()
    const index = activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Activity not found")
    }
    const updatedActivity = {
      ...activities[index],
      ...activityData,
      Id: parseInt(id)
    }
    activities[index] = updatedActivity
    return { ...updatedActivity }
  },

  async delete(id) {
    await delay()
    const index = activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Activity not found")
    }
    const deletedActivity = activities[index]
    activities.splice(index, 1)
    return { ...deletedActivity }
  }
}