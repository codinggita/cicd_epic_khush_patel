import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

// Async Thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await API.get(`/users?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user');
    }
  }
);

export const createUserByAdmin = createAsyncThunk(
  'users/createUserByAdmin',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post('/users', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create user');
    }
  }
);

export const updateUserByAdmin = createAsyncThunk(
  'users/updateUserByAdmin',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update user');
    }
  }
);

export const deleteUserByAdmin = createAsyncThunk(
  'users/deleteUserByAdmin',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/users/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    usersList: [],
    pagination: {},
    selectedUser: null,
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearUserErrors: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create User
      .addCase(createUserByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList.unshift(action.payload.data);
        state.successMessage = action.payload.message;
      })
      .addCase(createUserByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUserByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = state.usersList.map(item => 
          item._id === action.payload.data._id ? action.payload.data : item
        );
        state.successMessage = action.payload.message;
      })
      .addCase(updateUserByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.usersList = state.usersList.filter(item => item._id !== action.payload.id);
        state.successMessage = action.payload.message;
      })
      .addCase(deleteUserByAdmin.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearUserErrors, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
