import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apperService } from '../services/apperService'

// Check if user is already authenticated
export const checkAuthStatus = createAsyncThunk(
  'user/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const user = await apperService.getCurrentUser()
      return user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Logout user
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apperService.logout()
      return null
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const updatedUser = await apperService.updateUserProfile(userData)
      return updatedUser
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.isLoading = false
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { setUser, clearUser, setError } = userSlice.actions
export default userSlice.reducer