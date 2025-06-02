import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  recommendations: [],
  currentRecommendation: null,
  loading: false,
  error: null,
};

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
    setCurrentRecommendation: (state, action) => {
      state.currentRecommendation = action.payload;
    },
    addRecommendation: (state, action) => {
      state.recommendations = [action.payload, ...state.recommendations];
    },
    updateRecommendation: (state, action) => {
      state.recommendations = state.recommendations.map((recommendation) =>
        recommendation.id === action.payload.id ? action.payload : recommendation
      );
      if (state.currentRecommendation && state.currentRecommendation.id === action.payload.id) {
        state.currentRecommendation = action.payload;
      }
    },
    markRecommendationAsRead: (state, action) => {
      const id = action.payload;
      state.recommendations = state.recommendations.map((recommendation) =>
        recommendation.id === id ? { ...recommendation, isRead: true } : recommendation
      );
      if (state.currentRecommendation && state.currentRecommendation.id === id) {
        state.currentRecommendation = { ...state.currentRecommendation, isRead: true };
      }
    },
    markRecommendationHelpfulness: (state, action) => {
      const { id, isHelpful } = action.payload;
      state.recommendations = state.recommendations.map((recommendation) =>
        recommendation.id === id ? { ...recommendation, isHelpful } : recommendation
      );
      if (state.currentRecommendation && state.currentRecommendation.id === id) {
        state.currentRecommendation = { ...state.currentRecommendation, isHelpful };
      }
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
  setRecommendations,
  setCurrentRecommendation,
  addRecommendation,
  updateRecommendation,
  markRecommendationAsRead,
  markRecommendationHelpfulness,
  setLoading,
  setError,
  clearError,
} = recommendationSlice.actions;

export default recommendationSlice.reducer;