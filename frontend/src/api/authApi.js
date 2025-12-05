import axiosInstance from '../services/axiosConfig';

export const authAPI = {
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  getActivity: () => axiosInstance.get('/auth/activity'),
  refreshToken: () => axiosInstance.post('/auth/refresh-token'),
  requestPasswordReset: (data) => axiosInstance.post('/auth/password-reset/request', data),
  verifyResetToken: (data) => axiosInstance.post('/auth/password-reset/verify-token', data),
  resetPassword: (data) => axiosInstance.post('/auth/password-reset/reset', data),
  verifyEmail: (data) => axiosInstance.post('/auth/password-reset/verify-email', data),
  resendVerificationEmail: (data) =>
    axiosInstance.post('/auth/password-reset/resend-verification', data),
};
