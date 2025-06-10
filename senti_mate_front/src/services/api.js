/**
 * Base API service for making HTTP requests
 * This service provides methods for making HTTP requests to the backend API
 * It handles common functionality like setting headers, handling errors, etc.
 */
import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
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

/**
 * Make a GET request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional axios options
 * @returns {Promise<any>} Response data
 */
export const get = async (endpoint, options = {}) => {
  try {
    // Check if endpoint contains 'undefined' or 'null' as a parameter
    if (endpoint.includes('/undefined') || endpoint.includes('/null')) {
      throw new Error(`Invalid endpoint parameter in ${endpoint}`);
    }
    return await axiosInstance.get(endpoint, options);
  } catch (error) {
    console.error(`GET request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a POST request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional axios options
 * @returns {Promise<any>} Response data
 */
export const post = async (endpoint, data, options = {}) => {
  try {
    // Check if endpoint contains 'undefined' or 'null' as a parameter
    if (endpoint.includes('/undefined') || endpoint.includes('/null')) {
      throw new Error(`Invalid endpoint parameter in ${endpoint}`);
    }
    return await axiosInstance.post(endpoint, data, options);
  } catch (error) {
    console.error(`POST request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a PUT request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional axios options
 * @returns {Promise<any>} Response data
 */
export const put = async (endpoint, data, options = {}) => {
  try {
    // Check if endpoint contains 'undefined' or 'null' as a parameter
    if (endpoint.includes('/undefined') || endpoint.includes('/null')) {
      throw new Error(`Invalid endpoint parameter in ${endpoint}`);
    }
    return await axiosInstance.put(endpoint, data, options);
  } catch (error) {
    console.error(`PUT request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a PATCH request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional axios options
 * @returns {Promise<any>} Response data
 */
export const patch = async (endpoint, data, options = {}) => {
  try {
    // Check if endpoint contains 'undefined' or 'null' as a parameter
    if (endpoint.includes('/undefined') || endpoint.includes('/null')) {
      throw new Error(`Invalid endpoint parameter in ${endpoint}`);
    }
    return await axiosInstance.patch(endpoint, data, options);
  } catch (error) {
    console.error(`PATCH request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a DELETE request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional axios options
 * @returns {Promise<any>} Response data
 */
export const del = async (endpoint, options = {}) => {
  try {
    // Check if endpoint contains 'undefined' or 'null' as a parameter
    if (endpoint.includes('/undefined') || endpoint.includes('/null')) {
      throw new Error(`Invalid endpoint parameter in ${endpoint}`);
    }
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
  patch,
  delete: del
};
