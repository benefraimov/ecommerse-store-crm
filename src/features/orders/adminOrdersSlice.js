import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthConfig = (thunkAPI) => {
    const { auth: { user } } = thunkAPI.getState();
    return { headers: { Authorization: `Bearer ${user.token}` } };
};

// Thunk לשליפת כל ההזמנות
export const fetchAllOrders = createAsyncThunk('adminOrders/fetchAll', async (_, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/orders', config);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to fetch orders');
    }
});

export const fetchOrderById = createAsyncThunk('adminOrders/fetchById', async (orderId, thunkAPI) => {
    try {
        const { data } = await axios.get(`/api/orders/${orderId}`, getAuthConfig(thunkAPI));
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to fetch order details');
    }
});

export const markAsDelivered = createAsyncThunk('adminOrders/deliver', async (orderId, thunkAPI) => {
    try {
        const { data } = await axios.put(`/api/orders/${orderId}/deliver`, {}, getAuthConfig(thunkAPI));
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to mark as delivered');
    }
});

// --- SLICE DEFINITION ---
const initialState = {
    orders: [],
    selectedOrder: null, // <-- הוספנו state להזמנה ספציפית
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

const adminOrdersSlice = createSlice({
    name: 'adminOrders',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Orders
            .addCase(fetchAllOrders.pending, (state) => { state.isLoading = true; })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload;
            })
            // Fetch Order By ID
            .addCase(fetchOrderById.pending, (state) => { state.isLoading = true; })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload;
            })
            // Mark as Delivered
            .addCase(markAsDelivered.pending, (state) => { state.isLoading = true; })
            .addCase(markAsDelivered.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.selectedOrder = action.payload;
            })
            .addCase(markAsDelivered.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload;
            });
    }
});

export const { reset } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;