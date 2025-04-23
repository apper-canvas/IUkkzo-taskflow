import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apperService } from '../services/apperService'

// Fetch projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params = {}, { rejectWithValue }) => {
    try {
      const projects = await apperService.fetchProjects(params)
      return projects
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Create a new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const newProject = await apperService.createProject(projectData)
      return newProject
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Update a project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const updatedProject = await apperService.updateProject(id, projectData)
      return updatedProject
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Delete a project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await apperService.deleteProject(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
  },
  selectedProject: null,
}

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjectPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      }
    },
    selectProject: (state, action) => {
      state.selectedProject = action.payload
    },
    clearProjectErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.data
        state.pagination = {
          ...state.pagination,
          total: action.payload.totalCount,
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.items.unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.items.findIndex(project => project.Id === action.payload.Id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.selectedProject?.Id === action.payload.Id) {
          state.selectedProject = action.payload
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter(project => project.Id !== action.payload)
        state.pagination.total -= 1
        if (state.selectedProject?.Id === action.payload) {
          state.selectedProject = null
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { setProjectPagination, selectProject, clearProjectErrors } = projectSlice.actions
export default projectSlice.reducer