import axios from 'axios';

// Use relative path to leverage Vite proxy
const API_BASE_URL = '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unknown error occurred';

    console.error(`API error: ${message}`, error);
    return Promise.reject(new Error(message));
  }
);

export const get = async (endpoint, options = {}) => {
  try {
    return await axiosInstance.get(endpoint, options);
  } catch (error) {
    console.error(`GET request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const post = async (endpoint, data, options = {}) => {
  try {
    return await axiosInstance.post(endpoint, data, options);
  } catch (error) {
    console.error(`POST request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const put = async (endpoint, data, options = {}) => {
  try {
    return await axiosInstance.put(endpoint, data, options);
  } catch (error) {
    console.error(`PUT request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const del = async (endpoint, options = {}) => {
  try {
    return await axiosInstance.delete(endpoint, options);
  } catch (error) {
    console.error(`DELETE request failed for ${endpoint}:`, error);
    throw error;
  }
};

export default {
  get,
  post,
  put,
  delete: del
};