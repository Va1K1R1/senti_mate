import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  healthData: [],
  healthDataByType: {
    steps: [],
    heart_rate: [],
    sleep: [],
    exercise: [],
  },
  healthDataStats: null,
  syncStatus: null,
  loading: false,
  error: null,
};

const healthDataSlice = createSlice({
  name: 'healthData',
  initialState,
  reducers: {
    setHealthData: (state, action) => {
      state.healthData = action.payload;
    },
    setHealthDataByType: (state, action) => {
      const { type, data } = action.payload;
      state.healthDataByType[type] = data;
    },
    setHealthDataStats: (state, action) => {
      state.healthDataStats = action.payload;
    },
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setHealthData,
  setHealthDataByType,
  setHealthDataStats,
  setSyncStatus,
  setLoading,
  setError,
  clearError,
} = healthDataSlice.actions;

export default healthDataSlice.reducer;