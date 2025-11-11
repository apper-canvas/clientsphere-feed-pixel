import tagsData from "@/services/mockData/tags.json"

let tags = [...tagsData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const tagService = {
  async getAll() {
    await delay()
    return [...tags]
  },

  async getById(id) {
    await delay()
    const tag = tags.find(t => t.Id === parseInt(id))
    if (!tag) {
      throw new Error("Tag not found")
    }
    return { ...tag }
  },

  async create(tagData) {
    await delay()
    const maxId = Math.max(...tags.map(t => t.Id), 0)
    const newTag = {
      Id: maxId + 1,
      ...tagData
    }
    tags.push(newTag)
    return { ...newTag }
  },

  async update(id, tagData) {
    await delay()
    const index = tags.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Tag not found")
    }
    const updatedTag = {
      ...tags[index],
      ...tagData,
      Id: parseInt(id)
    }
    tags[index] = updatedTag
    return { ...updatedTag }
  },

  async delete(id) {
    await delay()
    const index = tags.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Tag not found")
    }
    const deletedTag = tags[index]
    tags.splice(index, 1)
    return { ...deletedTag }
  }
}