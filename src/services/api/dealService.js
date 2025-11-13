import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const dealService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('deals_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expectedCloseDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.getRecordById('deals_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expectedCloseDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "contactId_c"}},
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
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('deals_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expectedCloseDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "contactId_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching deals for contact ${contactId}:`, error?.response?.data?.message || error);
      return [];
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Map field names to database schema
      const mappedData = {
        Name: dealData.title_c || dealData.title || 'New Deal',
        title_c: dealData.title_c || dealData.title,
        stage_c: dealData.stage_c || dealData.stage,
        value_c: parseFloat(dealData.value_c || dealData.value || 0),
        probability_c: parseInt(dealData.probability_c || dealData.probability || 0),
        expectedCloseDate_c: dealData.expectedCloseDate_c || dealData.expectedCloseDate,
        notes_c: dealData.notes_c || dealData.notes,
        currency_c: dealData.currency_c || dealData.currency || 'USD',
        contactId_c: parseInt(dealData.contactId_c || dealData.contactId)
      };

      // Remove undefined/null values
      Object.keys(mappedData).forEach(key => {
        if (mappedData[key] === undefined || mappedData[key] === null || mappedData[key] === '') {
          delete mappedData[key];
        }
      });

      const response = await apperClient.createRecord('deals_c', {
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
          console.error(`Failed to create ${failed.length} deals:`, failed);
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
      console.error("Error creating deal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, dealData) {
    return await this.updateStage(parseInt(id), dealData.stage_c || dealData.stage, dealData);
  },

  async updateStage(id, newStage, additionalData = {}) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Map field names to database schema
      const mappedData = {
        Id: parseInt(id),
        stage_c: newStage,
        ...additionalData
      };

      // Map any legacy field names
      if (mappedData.title) {
        mappedData.title_c = mappedData.title;
        delete mappedData.title;
      }
      if (mappedData.value) {
        mappedData.value_c = parseFloat(mappedData.value);
        delete mappedData.value;
      }
      if (mappedData.probability) {
        mappedData.probability_c = parseInt(mappedData.probability);
        delete mappedData.probability;
      }
      if (mappedData.expectedCloseDate) {
        mappedData.expectedCloseDate_c = mappedData.expectedCloseDate;
        delete mappedData.expectedCloseDate;
      }
      if (mappedData.notes) {
        mappedData.notes_c = mappedData.notes;
        delete mappedData.notes;
      }
      if (mappedData.currency) {
        mappedData.currency_c = mappedData.currency;
        delete mappedData.currency;
      }
      if (mappedData.contactId) {
        mappedData.contactId_c = parseInt(mappedData.contactId);
        delete mappedData.contactId;
      }

      // Remove undefined/null values
      Object.keys(mappedData).forEach(key => {
        if (mappedData[key] === undefined || mappedData[key] === null || mappedData[key] === '') {
          delete mappedData[key];
        }
      });

      const response = await apperClient.updateRecord('deals_c', {
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
          console.error(`Failed to update ${failed.length} deals:`, failed);
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
      console.error(`Error updating deal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.deleteRecord('deals_c', {
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
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(`Error deleting deal ${id}:`, error?.response?.data?.message || error);
      return false;
    }
  }
};