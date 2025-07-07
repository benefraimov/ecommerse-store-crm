import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthConfig = (thunkAPI) => {
    const { auth: { user } } = thunkAPI.getState();
    return { headers: { Authorization: `Bearer ${user.token}` } };
};

// Thunk לשליפת כל המוצרים עבור המנהל
export const fetchAdminProducts = createAsyncThunk('adminProducts/fetchAll', async (_, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/products/admin', config);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Failed to fetch products');
    }
});

export const createProduct = createAsyncThunk('adminProducts/create', async (_, thunkAPI) => {
    try {
        const { data } = await axios.post('/api/products', {}, getAuthConfig(thunkAPI));
        return data;
    } catch (error) { return thunkAPI.rejectWithValue('Failed to create product'); }
});

export const updateProduct = createAsyncThunk('adminProducts/update', async (productData, thunkAPI) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json', ...getAuthConfig(thunkAPI).headers } };
        const { data } = await axios.put(`/api/products/${productData._id}`, productData, config);
        return data;
    } catch (error) { return thunkAPI.rejectWithValue('Failed to update product'); }
});

export const deleteProduct = createAsyncThunk('adminProducts/delete', async (productId, thunkAPI) => {
    try {
        await axios.delete(`/api/products/${productId}`, getAuthConfig(thunkAPI));
        return productId;
    } catch (error) { return thunkAPI.rejectWithValue('Failed to delete product'); }
});

// --- SLICE DEFINITION ---
const initialState = { products: [], isLoading: false, isError: false, isSuccess: false, message: '' };

const adminProductSlice = createSlice({
    name: 'adminProducts',
    initialState,
    reducers: {
        resetAdminProductStatus: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAdminProducts.pending, (state) => { state.isLoading = true; })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => { state.isLoading = false; state.products = action.payload; })
            .addCase(fetchAdminProducts.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
            // Create
            .addCase(createProduct.pending, (state) => { state.isLoading = true; })
            .addCase(createProduct.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.products.push(action.payload); })
            .addCase(createProduct.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
            // Update
            .addCase(updateProduct.pending, (state) => { state.isLoading = true; })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) state.products[index] = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
            // Delete
            .addCase(deleteProduct.pending, (state) => { state.isLoading = true; })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = state.products.filter(p => p._id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; });
    }
});

export const { resetAdminProductStatus } = adminProductSlice.actions;
export default adminProductSlice.reducer;