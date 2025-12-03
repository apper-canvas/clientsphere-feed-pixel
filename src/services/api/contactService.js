import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const contactService = {
async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('contacts_c', {
fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "file_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  },
  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

const response = await apperClient.getRecordById('contacts_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "file_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Map field names to database schema
      const mappedData = {
        Name: contactData.name_c || contactData.name || 'New Contact',
        name_c: contactData.name_c || contactData.name,
        email_c: contactData.email_c || contactData.email,
phone_c: contactData.phone_c || contactData.phone,
        title_c: contactData.title_c || contactData.title,
        company_c: contactData.company_c || contactData.company,
        notes_c: contactData.notes_c || contactData.notes,
        tags_c: Array.isArray(contactData.tags_c || contactData.tags) 
          ? (contactData.tags_c || contactData.tags).join(',') 
          : (contactData.tags_c || contactData.tags || ''),
        ...(contactData.file_c && Array.isArray(contactData.file_c) && contactData.file_c.length > 0 && {
          file_c: contactData.file_c
        })
      };

      // Remove undefined/null values
      Object.keys(mappedData).forEach(key => {
        if (mappedData[key] === undefined || mappedData[key] === null || mappedData[key] === '') {
          delete mappedData[key];
        }
      });

      const response = await apperClient.createRecord('contacts_c', {
        records: [mappedData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Map field names to database schema
      const mappedData = {
        Id: parseInt(id),
        ...contactData
      };

      // Map any legacy field names
      if (mappedData.name) {
        mappedData.name_c = mappedData.name;
        delete mappedData.name;
      }
      if (mappedData.email) {
        mappedData.email_c = mappedData.email;
        delete mappedData.email;
      }
      if (mappedData.phone) {
        mappedData.phone_c = mappedData.phone;
        delete mappedData.phone;
      }
      if (mappedData.title) {
        mappedData.title_c = mappedData.title;
        delete mappedData.title;
      }
      if (mappedData.company) {
mappedData.company_c = mappedData.company;
        delete mappedData.company;
      }
      if (mappedData.notes) {
        mappedData.notes_c = mappedData.notes;
        delete mappedData.notes;
      }
      if (mappedData.tags) {
        mappedData.tags_c = Array.isArray(mappedData.tags) 
          ? mappedData.tags.join(',') 
          : mappedData.tags;
        delete mappedData.tags;
      }
      if (mappedData.file_c && Array.isArray(mappedData.file_c) && mappedData.file_c.length > 0) {
        // File field already in correct format for update
      }

      // Remove undefined/null values
      Object.keys(mappedData).forEach(key => {
        if (mappedData[key] === undefined || mappedData[key] === null || mappedData[key] === '') {
          delete mappedData[key];
        }
      });

      const response = await apperClient.updateRecord('contacts_c', {
        records: [mappedData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error updating contact ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.deleteRecord('contacts_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error?.response?.data?.message || error);
      return false;
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const searchTerm = query.toLowerCase();
      
      const response = await apperClient.fetchRecords('contacts_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "title_c"}},
{"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "file_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "name_c", "operator": "Contains", "values": [searchTerm]}], "operator": "OR"},
            {"conditions": [{"fieldName": "email_c", "operator": "Contains", "values": [searchTerm]}], "operator": "OR"},
            {"conditions": [{"fieldName": "company_c", "operator": "Contains", "values": [searchTerm]}], "operator": "OR"},
            {"conditions": [{"fieldName": "title_c", "operator": "Contains", "values": [searchTerm]}], "operator": "OR"},
            {"conditions": [{"fieldName": "tags_c", "operator": "Contains", "values": [searchTerm]}], "operator": "OR"}
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error searching contacts:`, error?.response?.data?.message || error);
      return [];
    }
  }
};