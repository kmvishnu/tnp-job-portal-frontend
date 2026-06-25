import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../api/axios';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  experienceLevel: string;
  salary: number;
  postedById: string;
  postedBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface JobState {
  jobs: Job[];
  metadata: PaginationMetadata | null;
  loading: boolean;
  actionLoading: boolean; // specifically for create/update/delete/apply operations
  appliedJobIds: string[];
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  metadata: null,
  loading: false,
  actionLoading: false,
  appliedJobIds: (() => {
    try {
      return JSON.parse(localStorage.getItem('applied_job_ids') || '[]');
    } catch {
      return [];
    }
  })(),
  error: null,
};

interface FetchJobsParams {
  category?: string;
  experienceLevel?: string;
  page?: number;
  limit?: number;
}

// Async Thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (params: FetchJobsParams | undefined, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/jobs', { params });
      return response.data.data; // contains jobs and metadata
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch jobs';
      return rejectWithValue(message);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData: Omit<Job, 'id' | 'postedById' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/jobs', jobData);
      return response.data.data.job;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create job';
      return rejectWithValue(message);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ id, jobData }: { id: string; jobData: Partial<Job> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/jobs/${id}`, jobData);
      return response.data.data.job;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update job';
      return rejectWithValue(message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/jobs/${id}`);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete job';
      return rejectWithValue(message);
    }
  }
);

export const applyForJob = createAsyncThunk(
  'jobs/apply',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/applications', { jobId });
      return { jobId, application: response.data.data.application };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit application';
      return rejectWithValue(message);
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<{ jobs: Job[]; metadata: PaginationMetadata }>) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.metadata = action.payload.metadata;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Job
    builder
      .addCase(createJob.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.actionLoading = false;
        state.jobs.unshift(action.payload); // prepends the new job
      })
      .addCase(createJob.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Update Job
    builder
      .addCase(updateJob.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.actionLoading = false;
        state.jobs = state.jobs.map((job) =>
          job.id === action.payload.id ? action.payload : job
        );
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Delete Job
    builder
      .addCase(deleteJob.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionLoading = false;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Apply For Job
    builder
      .addCase(applyForJob.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action: PayloadAction<{ jobId: string; application: any }>) => {
        state.actionLoading = false;
        if (!state.appliedJobIds.includes(action.payload.jobId)) {
          state.appliedJobIds.push(action.payload.jobId);
          localStorage.setItem('applied_job_ids', JSON.stringify(state.appliedJobIds));
        }
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearJobError } = jobSlice.actions;
export default jobSlice.reducer;
