import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bidsApi } from '@/lib/api';
import type { BidsState, Bid } from '@/types';
import { updateGigStatus } from './gigsSlice';

const initialState: BidsState = {
  bids: {},
  isLoading: false,
  error: null,
};

export const fetchBidsByGig = createAsyncThunk(
  'bids/fetchByGig',
  async (gigId: string, { rejectWithValue }) => {
    try {
      const response = await bidsApi.getByGig(gigId);
      return { gigId, bids: response.bids };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
    }
  }
);

export const createBid = createAsyncThunk(
  'bids/create',
  async (data: { gigId: string; message: string; price: number }, { rejectWithValue }) => {
    try {
      const response = await bidsApi.create(data);
      return { gigId: data.gigId, bid: response.bid };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bid');
    }
  }
);

export const hireBid = createAsyncThunk(
  'bids/hire',
  async ({ bidId, gigId }: { bidId: string; gigId: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await bidsApi.hire(bidId);
      // Update gig status to assigned
      dispatch(updateGigStatus({ gigId, status: 'assigned' }));
      return { gigId, bids: response.bids };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to hire');
    }
  }
);

const bidsSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    clearBidsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bids
      .addCase(fetchBidsByGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBidsByGig.fulfilled, (state, action: PayloadAction<{ gigId: string; bids: Bid[] }>) => {
        state.isLoading = false;
        state.bids[action.payload.gigId] = action.payload.bids;
      })
      .addCase(fetchBidsByGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create bid
      .addCase(createBid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action: PayloadAction<{ gigId: string; bid: Bid }>) => {
        state.isLoading = false;
        if (!state.bids[action.payload.gigId]) {
          state.bids[action.payload.gigId] = [];
        }
        state.bids[action.payload.gigId].push(action.payload.bid);
      })
      .addCase(createBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Hire bid
      .addCase(hireBid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hireBid.fulfilled, (state, action: PayloadAction<{ gigId: string; bids: Bid[] }>) => {
        state.isLoading = false;
        state.bids[action.payload.gigId] = action.payload.bids;
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBidsError } = bidsSlice.actions;
export default bidsSlice.reducer;
