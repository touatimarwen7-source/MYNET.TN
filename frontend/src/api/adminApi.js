import axiosInstance from '../services/axiosConfig';

export const adminAPI = {
  getUsers: (filters) => axiosInstance.get('/admin/users', { params: filters }),
  getStatistics: () => axiosInstance.get('/admin/statistics'),
  verifyUser: (id) => axiosInstance.post(`/admin/users/${id}/verify`),
  toggleUserStatus: (id, data) => axiosInstance.put(`/admin/users/${id}/toggle-status`, data),
  updateUserRole: (userId, role) => axiosInstance.put(`/admin/users/${userId}/role`, { role }),
  toggleUserBlock: (userId, block) =>
    axiosInstance.put(`/admin/users/${userId}/block`, { blocked: block }),
  sendPasswordReset: (userId) => axiosInstance.post(`/admin/users/${userId}/reset-password`),
  deleteUser: (userId) => axiosInstance.delete(`/admin/users/${userId}`),
};
