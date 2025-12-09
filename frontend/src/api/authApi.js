/**
 * Authentication API
 * Handles login, register, password reset, email verification
 */
import axiosInstance from './axiosConfig.js';

export const authAPI = {
  login: (credentials) => axiosInstance.post('/api/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/profile'),
  updateProfile: (data) => axiosInstance.put('/profile', data),
};