import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apperService } from '../services/apperService'

// Fetch tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const tasks = await apperService.fetchTasks(params)
      return tasks
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Create a new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const newTask = await apperService.createTask(taskData)
      return newTask
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Update a task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const updatedTask = await apperService.updateTask(id, taskData)
      return updatedTask
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Delete a task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await apperService.deleteTask(id)
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
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTaskPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      }
    },
    clearTaskErrors: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.data
        state.pagination = {
          ...state.pagination,
          total: action.payload.totalCount,
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.items.unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.items.findIndex(task => task.Id === action.payload.Id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter(task => task.Id !== action.payload)
        state.pagination.total -= 1
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { setTaskPagination, clearTaskErrors } = taskSlice.actions
export default taskSlice.reducer