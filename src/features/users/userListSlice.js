import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthConfig = (thunkAPI) => {
    const { auth: { user } } = thunkAPI.getState();
    return { headers: { Authorization: `Bearer ${user.token}` } };
};

export const getUsers = createAsyncThunk('users/getAll', async (_, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/users', config);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// 1. Thunk חדש לשינוי הרשאות
export const toggleAdminStatus = createAsyncThunk('users/toggleAdmin', async (userId, thunkAPI) => {
    try {
        const { data } = await axios.put(`/api/users/${userId}/toggle-admin`, {}, getAuthConfig(thunkAPI));
        // נחזיר את ה-ID של המשתמש שעודכן כדי שנוכל לעדכן אותו ב-state
        return userId;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});
const initialState = {
    users: [],
    isLoading: false,
    isError: false,
    message: '',
};

const userListSlice = createSlice({
    name: 'userList',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => { state.isLoading = true; })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(toggleAdminStatus.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user._id === action.payload);
                if (index !== -1) {
                    state.users[index].isAdmin = !state.users[index].isAdmin;
                }
            });
    }
});

export const { reset } = userListSlice.actions;
export default userListSlice.reducer;