import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async (_, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/dashboard/stats', config);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to fetch stats');
    }
});

const initialState = {
    stats: { totalUsers: 0, totalProducts: 0, totalOrders: 0, totalSales: 0 },
    isLoading: false,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => { state.isLoading = true; })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state) => { state.isLoading = false; });
    }
});

export default dashboardSlice.reducer;