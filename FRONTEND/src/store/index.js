import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dataReducer from './dataSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    users: userReducer
  }
});
