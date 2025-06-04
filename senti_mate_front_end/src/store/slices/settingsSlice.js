import { createSlice } from '@reduxjs/toolkit';

// Load settings from localStorage if available
const loadSettingsFromStorage = () => {
  try {
    const storedSettings = localStorage.getItem('appSettings');
    return storedSettings ? JSON.parse(storedSettings) : null;
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
    return null;
  }
};

// Initial state with default values and localStorage persistence
const initialState = loadSettingsFromStorage() || {
  darkMode: false,
  emailNotifications: true,
  pushNotifications: false,
  language: 'english',
  privacyLevel: 'friends',
  fontScale: 1,
  highContrast: false,
  autoSave: true,
  dataSync: {
    enabled: true,
    frequency: 'daily',
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSetting: (state, action) => {
      const setting = action.payload;
      state[setting] = !state[setting];
      localStorage.setItem('appSettings', JSON.stringify(state));
    },
    updateSetting: (state, action) => {
      const { setting, value } = action.payload;
      state[setting] = value;
      localStorage.setItem('appSettings', JSON.stringify(state));
    },
    updateDataSyncSettings: (state, action) => {
      state.dataSync = { ...state.dataSync, ...action.payload };
      localStorage.setItem('appSettings', JSON.stringify(state));
    },
    resetSettings: state => {
      // Reset to default values but keep the current state structure
      const defaultSettings = {
        darkMode: false,
        emailNotifications: true,
        pushNotifications: false,
        language: 'english',
        privacyLevel: 'friends',
        fontScale: 1,
        highContrast: false,
        autoSave: true,
        dataSync: {
          enabled: true,
          frequency: 'daily',
        },
      };

      Object.keys(defaultSettings).forEach(key => {
        state[key] = defaultSettings[key];
      });

      localStorage.setItem('appSettings', JSON.stringify(state));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  toggleSetting,
  updateSetting,
  updateDataSyncSettings,
  resetSettings,
  setLoading,
  setError,
  clearError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
