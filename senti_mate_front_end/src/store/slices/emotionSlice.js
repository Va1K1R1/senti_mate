import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emotions: [],
  selectedEmotion: null,
  emotionStats: null,
  loading: false,
  error: null,
};

const emotionSlice = createSlice({
  name: 'emotion',
  initialState,
  reducers: {
    setEmotions: (state, action) => {
      state.emotions = action.payload;
    },
    setSelectedEmotion: (state, action) => {
      state.selectedEmotion = action.payload;
    },
    setEmotionStats: (state, action) => {
      state.emotionStats = action.payload;
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
  setEmotions,
  setSelectedEmotion,
  setEmotionStats,
  setLoading,
  setError,
  clearError,
} = emotionSlice.actions;

export default emotionSlice.reducer;