import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todoSlice';
import diaryReducer from './slices/diarySlice';
import authReducer from './slices/authSlice';
import emotionReducer from './slices/emotionSlice';
import healthDataReducer from './slices/healthDataSlice';
import recommendationReducer from './slices/recommendationSlice';

const store = configureStore({
  reducer: {
    todo: todoReducer,
    diary: diaryReducer,
    auth: authReducer,
    emotion: emotionReducer,
    healthData: healthDataReducer,
    recommendation: recommendationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;