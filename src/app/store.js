import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../features/tasks/tasksSlice.js';
import authReducer from "../features/auth/authSlice.js"
export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer,
  },
});