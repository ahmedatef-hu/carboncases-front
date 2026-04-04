import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://carboncases-back.vercel.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  // For admin routes, use adminToken
  if (config.url.includes('/admin')) {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    // For user routes, use regular token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if it's an admin route
      if (error.config?.url?.includes('/admin')) {
        console.log('❌ Admin 401 error - clearing admin credentials');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        // Don't redirect here - let the component handle it
      } else {
        console.log('❌ User 401 error - clearing user credentials');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
