import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  diaryEntries: [],
  currentEntry: null,
  loading: false,
  error: null,
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setDiaryEntries: (state, action) => {
      state.diaryEntries = action.payload;
    },
    setCurrentEntry: (state, action) => {
      state.currentEntry = action.payload;
    },
    addDiaryEntry: (state, action) => {
      state.diaryEntries = [action.payload, ...state.diaryEntries];
    },
    updateDiaryEntry: (state, action) => {
      state.diaryEntries = state.diaryEntries.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry
      );
      if (state.currentEntry?.id === action.payload.id) {
        state.currentEntry = action.payload;
      }
    },
    deleteDiaryEntry: (state, action) => {
      state.diaryEntries = state.diaryEntries.filter((entry) => entry.id !== action.payload);
      if (state.currentEntry && state.currentEntry.id === action.payload) {
        state.currentEntry = null;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDiaryEntries,
  setCurrentEntry,
  addDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  setLoading,
  setError,
} = diarySlice.actions;

export default diarySlice.reducer;