// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('crmUser'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        login: (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
            localStorage.setItem('crmUser', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('crmUser');
        }
    },
    extraReducers: (builder) => {

    },
});

export const { reset, login, logout } = authSlice.actions;
export default authSlice.reducer;