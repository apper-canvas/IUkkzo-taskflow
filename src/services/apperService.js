// Service for interacting with the Apper SDK
let ApperClient = null
let ApperUI = null
let apperClient = null

// Tables from the Apper database
const TABLES = {
  USER: 'User',
  TASK: 'task3',
  PROJECT: 'project',
  USER1: 'User1',
}

// Initialize the Apper service with the canvas ID
export const initializeAppService = (canvasId) => {
  if (!window.ApperSDK) {
    console.error('Apper SDK not loaded. Make sure the script is included in index.html')
    return
  }

  // Get ApperSDK components
  ApperClient = window.ApperSDK.ApperClient
  ApperUI = window.ApperSDK.ApperUI

  // Initialize ApperClient with canvas ID
  apperClient = new ApperClient(canvasId)

  return { ApperClient, ApperUI, apperClient }
}

// Get the current instance of apperClient
export const getApperClient = () => {
  if (!apperClient) {
    throw new Error('ApperClient not initialized. Call initializeAppService first.')
  }
  return apperClient
}

export const apperService = {
  // User Authentication Methods
  getCurrentUser: async () => {
    try {
      // Check local storage for user data
      const userData = localStorage.getItem('apperUser')
      if (userData) {
        return JSON.parse(userData)
      }
      return null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  logout: async () => {
    try {
      // Clear the user data from local storage
      localStorage.removeItem('apperUser')
      // ApperSDK will handle token invalidation automatically
      return true
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  },

  updateUserProfile: async (userData) => {
    try {
      const response = await apperClient.updateRecord(TABLES.USER, userData.Id, {
        record: userData,
      })
      
      // Update local storage with new user data
      const currentUser = JSON.parse(localStorage.getItem('apperUser'))
      if (currentUser) {
        localStorage.setItem('apperUser', JSON.stringify({
          ...currentUser,
          ...response.data,
        }))
      }
      
      return response.data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  },

  // Task Methods
  fetchTasks: async (params = {}) => {
    try {
      const { filters, limit = 20, offset = 0, orderBy = [{ field: 'CreatedOn', direction: 'desc' }] } = params
      
      const fetchParams = {
        fields: [
          'Id', 'Name', 'title', 'description', 'status', 'priority', 
          'due_date', 'created_at', 'assignee', 'CreatedOn', 'ModifiedOn'
        ],
        pagingInfo: { limit, offset },
        orderBy,
      }
      
      if (filters) {
        fetchParams.filter = filters
      }
      
      const response = await apperClient.fetchRecords(TABLES.TASK, fetchParams)
      return {
        data: response.data,
        totalCount: response.totalCount,
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await apperClient.createRecord(TABLES.TASK, {
        record: {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status || 'Todo',
          priority: taskData.priority || 'Medium',
          due_date: taskData.dueDate,
          assignee: taskData.assignee,
          Name: taskData.title // Name field is required
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  },

  updateTask: async (id, taskData) => {
    try {
      const response = await apperClient.updateRecord(TABLES.TASK, id, {
        record: {
          ...taskData,
          Name: taskData.title // Update Name field as well
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },

  deleteTask: async (id) => {
    try {
      await apperClient.deleteRecord(TABLES.TASK, id)
      return id
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  },

  // Project Methods
  fetchProjects: async (params = {}) => {
    try {
      const { filters, limit = 20, offset = 0, orderBy = [{ field: 'CreatedOn', direction: 'desc' }] } = params
      
      const fetchParams = {
        fields: [
          'Id', 'Name', 'description', 'start_date', 'end_date', 
          'status', 'CreatedOn', 'ModifiedOn'
        ],
        pagingInfo: { limit, offset },
        orderBy,
      }
      
      if (filters) {
        fetchParams.filter = filters
      }
      
      const response = await apperClient.fetchRecords(TABLES.PROJECT, fetchParams)
      return {
        data: response.data,
        totalCount: response.totalCount,
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  },

  createProject: async (projectData) => {
    try {
      const response = await apperClient.createRecord(TABLES.PROJECT, {
        record: {
          Name: projectData.name,
          description: projectData.description,
          start_date: projectData.startDate,
          end_date: projectData.endDate,
          status: projectData.status || 'Not Started'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  },

  updateProject: async (id, projectData) => {
    try {
      const response = await apperClient.updateRecord(TABLES.PROJECT, id, {
        record: {
          Name: projectData.name,
          description: projectData.description,
          start_date: projectData.startDate,
          end_date: projectData.endDate,
          status: projectData.status
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  },

  deleteProject: async (id) => {
    try {
      await apperClient.deleteRecord(TABLES.PROJECT, id)
      return id
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  },

  // User1 methods (team members)
  fetchTeamMembers: async (params = {}) => {
    try {
      const { filters, limit = 50, offset = 0 } = params
      
      const fetchParams = {
        fields: ['Id', 'Name', 'email', 'role', 'avatar'],
        pagingInfo: { limit, offset },
      }
      
      if (filters) {
        fetchParams.filter = filters
      }
      
      const response = await apperClient.fetchRecords(TABLES.USER1, fetchParams)
      return {
        data: response.data,
        totalCount: response.totalCount,
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
      throw error
    }
  },

  getApperUI: () => {
    if (!ApperUI) {
      throw new Error('ApperUI not initialized. Call initializeAppService first.')
    }
    return ApperUI
  },
}

export default apperService