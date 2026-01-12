import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { gigsApi } from '@/lib/api';
import type { GigsState, Gig } from '@/types';

const initialState: GigsState = {
  gigs: [],
  currentGig: null,
  isLoading: false,
  error: null,
  searchQuery: '',
};

export const fetchGigs = createAsyncThunk(
  'gigs/fetchAll',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const response = await gigsApi.getAll(search);
      return response.gigs;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs');
    }
  }
);

export const fetchGigById = createAsyncThunk(
  'gigs/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await gigsApi.getById(id);
      return response.gig;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gig');
    }
  }
);

export const createGig = createAsyncThunk(
  'gigs/create',
  async (data: { title: string; description: string; budget: number }, { rejectWithValue }) => {
    try {
      const response = await gigsApi.create(data);
      return response.gig;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gig');
    }
  }
);

const gigsSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearCurrentGig: (state) => {
      state.currentGig = null;
    },
    updateGigStatus: (state, action: PayloadAction<{ gigId: string; status: 'open' | 'assigned' }>) => {
      const gig = state.gigs.find(g => g._id === action.payload.gigId);
      if (gig) {
        gig.status = action.payload.status;
      }
      if (state.currentGig?._id === action.payload.gigId) {
        state.currentGig.status = action.payload.status;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all gigs
      .addCase(fetchGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action: PayloadAction<Gig[]>) => {
        state.isLoading = false;
        state.gigs = action.payload;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single gig
      .addCase(fetchGigById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGigById.fulfilled, (state, action: PayloadAction<Gig>) => {
        state.isLoading = false;
        state.currentGig = action.payload;
      })
      .addCase(fetchGigById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create gig
      .addCase(createGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action: PayloadAction<Gig>) => {
        state.isLoading = false;
        state.gigs.unshift(action.payload);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, clearCurrentGig, updateGigStatus, clearError } = gigsSlice.actions;
export default gigsSlice.reducer;
