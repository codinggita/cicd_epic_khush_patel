import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

// Async Thunks
export const fetchWorkflows = createAsyncThunk(
  'data/fetchWorkflows',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await API.get(`/workflows?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch workflows');
    }
  }
);

export const fetchWorkflowById = createAsyncThunk(
  'data/fetchWorkflowById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/workflows/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch workflow');
    }
  }
);

export const fetchVersions = createAsyncThunk(
  'data/fetchVersions',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/workflows/${id}/versions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch versions');
    }
  }
);

export const fetchHistory = createAsyncThunk(
  'data/fetchHistory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/workflows/history/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch run history');
    }
  }
);

export const createWorkflow = createAsyncThunk(
  'data/createWorkflow',
  async (workflowData, { rejectWithValue }) => {
    try {
      const response = await API.post('/workflows', workflowData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create workflow');
    }
  }
);

export const updateWorkflow = createAsyncThunk(
  'data/updateWorkflow',
  async ({ id, workflowData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/workflows/${id}`, workflowData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update workflow');
    }
  }
);

export const patchWorkflowContent = createAsyncThunk(
  'data/patchWorkflowContent',
  async ({ id, workflowData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/workflows/${id}/content`, workflowData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to patch workflow');
    }
  }
);

export const deleteWorkflow = createAsyncThunk(
  'data/deleteWorkflow',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/workflows/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete workflow');
    }
  }
);

export const cloneWorkflow = createAsyncThunk(
  'data/cloneWorkflow',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.post(`/workflows/${id}/clone`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to clone workflow');
    }
  }
);

export const runWorkflow = createAsyncThunk(
  'data/runWorkflow',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.post(`/workflows/${id}/run`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to trigger run');
    }
  }
);

export const cancelRun = createAsyncThunk(
  'data/cancelRun',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.post(`/workflows/${id}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel run');
    }
  }
);

export const fetchLogs = createAsyncThunk(
  'data/fetchLogs',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/workflows/${id}/logs`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch logs');
    }
  }
);

export const fetchMetrics = createAsyncThunk(
  'data/fetchMetrics',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/workflows/${id}/metrics`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch metrics');
    }
  }
);

export const archiveWorkflow = createAsyncThunk(
  'data/archiveWorkflow',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/workflows/${id}/archive`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to archive workflow');
    }
  }
);

export const restoreWorkflow = createAsyncThunk(
  'data/restoreWorkflow',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/workflows/${id}/restore`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to restore workflow');
    }
  }
);

export const fetchInfraGuides = createAsyncThunk(
  'data/fetchInfraGuides',
  async ({ tech, queryParams = {} }, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await API.get(`/infra/${tech}?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || `Failed to fetch ${tech} guides`);
    }
  }
);

export const fetchAnalyticsWorkflows = createAsyncThunk(
  'data/fetchAnalyticsWorkflows',
  async (type, { rejectWithValue }) => {
    try {
      // type can be 'latest', 'trending', 'popular', 'recommended'
      const response = await API.get(`/workflows/${type}?limit=6`);
      return { type, data: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || `Failed to fetch analytics for ${type}`);
    }
  }
);

export const fetchRandomWorkflow = createAsyncThunk(
  'data/fetchRandomWorkflow',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/workflows/random');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch random workflow');
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    workflows: [],
    pagination: {},
    currentWorkflow: null,
    versions: [],
    history: [],
    logs: null,
    metrics: null,
    infraGuides: [],
    randomWorkflow: null,
    analytics: {
      latest: [],
      trending: [],
      popular: [],
      recommended: []
    },
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearDataErrors: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearCurrentWorkflow: (state) => {
      state.currentWorkflow = null;
      state.versions = [];
      state.history = [];
      state.logs = null;
      state.metrics = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Workflows
      .addCase(fetchWorkflows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Workflow By ID
      .addCase(fetchWorkflowById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkflowById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkflow = action.payload.data;
      })
      .addCase(fetchWorkflowById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Versions
      .addCase(fetchVersions.fulfilled, (state, action) => {
        state.versions = action.payload.data;
      })
      // Fetch History
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload.data;
      })
      // Run Workflow
      .addCase(runWorkflow.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        // Append run to history if active for same workflow
        if (state.currentWorkflow && state.currentWorkflow._id === action.payload.data.workflowId) {
          state.history.unshift(action.payload.data);
          state.logs = {
            runId: action.payload.data._id,
            status: action.payload.data.status,
            logs: action.payload.data.logs,
            createdAt: action.payload.data.createdAt
          };
          state.metrics = {
            runId: action.payload.data._id,
            status: action.payload.data.status,
            metrics: action.payload.data.metrics,
            createdAt: action.payload.data.createdAt
          };
          state.currentWorkflow.runCount += 1;
        }
      })
      // Cancel Run
      .addCase(cancelRun.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        if (state.logs && state.logs.runId === action.payload.data._id) {
          state.logs.status = 'cancelled';
          state.logs.logs = action.payload.data.logs;
        }
        // Update item in history list
        state.history = state.history.map(item => 
          item._id === action.payload.data._id ? action.payload.data : item
        );
      })
      // Fetch Logs
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.logs = action.payload.data;
      })
      // Fetch Metrics
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload.data;
      })
      // Fetch Infra Guides
      .addCase(fetchInfraGuides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfraGuides.fulfilled, (state, action) => {
        state.loading = false;
        state.infraGuides = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInfraGuides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Analytics categories
      .addCase(fetchAnalyticsWorkflows.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        state.analytics[type] = data;
      })
      // Fetch Random
      .addCase(fetchRandomWorkflow.fulfilled, (state, action) => {
        state.randomWorkflow = action.payload;
      })
      // Create Workflow
      .addCase(createWorkflow.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.workflows.unshift(action.payload.data);
      })
      // Update Workflow
      .addCase(updateWorkflow.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.currentWorkflow = action.payload.data;
        state.workflows = state.workflows.map(item => 
          item._id === action.payload.data._id ? action.payload.data : item
        );
      })
      // Patch Workflow
      .addCase(patchWorkflowContent.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.currentWorkflow = action.payload.data;
        state.workflows = state.workflows.map(item => 
          item._id === action.payload.data._id ? action.payload.data : item
        );
      })
      // Archive Workflow
      .addCase(archiveWorkflow.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.workflows = state.workflows.filter(item => item._id !== action.payload.data._id);
        if (state.currentWorkflow && state.currentWorkflow._id === action.payload.data._id) {
          state.currentWorkflow = null;
        }
      })
      // Restore Workflow
      .addCase(restoreWorkflow.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })
      // Delete Workflow
      .addCase(deleteWorkflow.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.workflows = state.workflows.filter(item => item._id !== action.payload.id);
        if (state.currentWorkflow && state.currentWorkflow._id === action.payload.id) {
          state.currentWorkflow = null;
        }
      })
      // Clone Workflow
      .addCase(cloneWorkflow.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.workflows.unshift(action.payload.data);
      });
  }
});

export const { clearDataErrors, clearCurrentWorkflow } = dataSlice.actions;
export default dataSlice.reducer;
