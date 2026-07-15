import axios from 'axios';
import useAuthStore from '../store/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach dynamic Bearer token
api.interceptors.request.use(
  (config) => {
    // Check local storage directly or get from auth store
    let token =
      useAuthStore.getState().accessToken ||
      localStorage.getItem('accessToken');

    if (!token) {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          token = parsed?.state?.accessToken || null;
        }
      } catch {
        // Ignore JSON parse errors if any
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors and 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // If 401 occurs and user is not already on login or register pages, clear auth and redirect
    if (status === 401 && !currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
      useAuthStore.getState().clearAuth();

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
