/**
 * Authentication API
 * Handles login, register, password reset, email verification
 */
import axiosInstance from './axiosConfig';

// Ensure we're using the correct base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/profile'),
  updateProfile: (data) => axiosInstance.put('/profile', data),
  requestPasswordReset: (data) => axiosInstance.post('/auth/request-password-reset', data),
  verifyResetToken: (data) => axiosInstance.post('/auth/verify-reset-token', data),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  verifyEmail: (data) => axiosInstance.post('/auth/verify-email', data),
  resendVerificationEmail: (data) => axiosInstance.post('/auth/resend-verification', data),
  getActivity: () => axiosInstance.get('/auth/activity'),

  // Buyer preferences
  updateBuyerPreferences: (data) => axiosInstance.put('/profile/buyer/preferences', data),
  getBuyerPreferences: () => axiosInstance.get('/profile/buyer/preferences'),

  // Supplier preferences
  updateSupplierPreferences: (data) => axiosInstance.put('/profile/supplier/preferences', data),
  getSupplierPreferences: () => axiosInstance.get('/profile/supplier/preferences'),
};