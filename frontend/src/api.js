/**
 * API Module - Updated to use secure token management
 * All API calls go through axios with security interceptors
 */

import axiosInstance from './services/axiosConfig';

// API endpoints
export const authAPI = {
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  getActivity: () => axiosInstance.get('/auth/activity'),
  refreshToken: () => axiosInstance.post('/auth/refresh-token')
};

export const procurementAPI = {
  getTenders: (filters) => axiosInstance.get('/procurement/tenders', { params: filters }),
  getTender: (id) => axiosInstance.get(`/procurement/tenders/${id}`),
  createTender: (data) => axiosInstance.post('/procurement/tenders', data),
  updateTender: (id, data) => axiosInstance.put(`/procurement/tenders/${id}`, data),
  deleteTender: (id) => axiosInstance.delete(`/procurement/tenders/${id}`),
  publishTender: (id) => axiosInstance.post(`/procurement/tenders/${id}/publish`),
  closeTender: (id) => axiosInstance.post(`/procurement/tenders/${id}/close`),
  getMyTenders: (filters) => axiosInstance.get('/procurement/my-tenders', { params: filters }),
  
  getOffers: (tenderId) => axiosInstance.get(`/procurement/tenders/${tenderId}/offers`),
  getMyOffers: () => axiosInstance.get('/procurement/my-offers'),
  createOffer: (data) => axiosInstance.post('/procurement/offers', data),
  evaluateOffer: (id, data) => axiosInstance.post(`/procurement/offers/${id}/evaluate`, data),
  selectWinner: (id) => axiosInstance.post(`/procurement/offers/${id}/select-winner`),
  rejectOffer: (id) => axiosInstance.post(`/procurement/offers/${id}/reject`)
};

export const searchAPI = {
  searchTenders: (params) => axiosInstance.get('/search/tenders', { params }),
  searchSuppliers: (params) => axiosInstance.get('/search/suppliers', { params })
};

export const adminAPI = {
  getUsers: (filters) => axiosInstance.get('/admin/users', { params: filters }),
  getStatistics: () => axiosInstance.get('/admin/statistics'),
  verifyUser: (id) => axiosInstance.post(`/admin/users/${id}/verify`),
  toggleUserStatus: (id, data) => axiosInstance.put(`/admin/users/${id}/toggle-status`, data)
};

export default axiosInstance;
