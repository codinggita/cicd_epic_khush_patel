import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/signup', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const loadProfile = createAsyncThunk(
  'auth/loadProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/auth/profile');
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue(error.response?.data?.error || 'Session expired');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await API.put('/auth/profile', profileData);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Profile update failed');
    }
  }
);

// Initial State helper
const token = localStorage.getItem('token') || null;
const userString = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token,
    user,
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = null;
      state.user = null;
      state.error = null;
      state.successMessage = null;
    },
    clearAuthErrors: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.data;
        state.successMessage = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.data;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load Profile
      .addCase(loadProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.successMessage = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearAuthErrors } = authSlice.actions;
export default authSlice.reducer;
