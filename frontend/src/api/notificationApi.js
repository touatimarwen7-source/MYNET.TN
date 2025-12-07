
import axiosInstance from '../services/axiosConfig';

export const notificationAPI = {
  getNotifications: (params) => axiosInstance.get('/notifications', { params }),
  markAsRead: (notificationId) => axiosInstance.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => axiosInstance.put('/notifications/read-all'),
  deleteNotification: (notificationId) => axiosInstance.delete(`/notifications/${notificationId}`),
  getUnreadCount: () => axiosInstance.get('/notifications/count/unread')
};
