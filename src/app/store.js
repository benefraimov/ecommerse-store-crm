import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userListReducer from '../features/users/userListSlice';
import adminProductReducer from '../features/products/adminProductSlice'; // <-- ייבוא
import adminOrdersReducer from '../features/orders/adminOrdersSlice'; // <-- ייבוא
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        userList: userListReducer,
        adminProducts: adminProductReducer,
        adminOrders: adminOrdersReducer, // <-- הוספה
        dashboard: dashboardReducer
    },
});