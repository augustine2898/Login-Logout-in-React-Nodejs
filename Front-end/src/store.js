import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import adminReducer from './features/adminSlice';
import adminUserReducer from './features/adminUserSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    adminUsers: adminUserReducer,
    
  },
});
