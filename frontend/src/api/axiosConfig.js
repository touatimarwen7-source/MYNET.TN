import axios from 'axios';

// Base URL configuration
const getBaseURL = () => {
  // Use environment variable if set
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window === 'undefined') {
    return 'http://172.31.68.98:3000';
  }

  const hostname = window.location.hostname;
  const isReplit = hostname.includes('replit.dev') || hostname.includes('repl.co');

  if (isReplit) {
    const baseHost = hostname.split(':')[0];
    return `http://${baseHost}:3000`;
  }

  // Always use the network IP for Replit environment
  return 'http://172.31.68.98:3000';
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;