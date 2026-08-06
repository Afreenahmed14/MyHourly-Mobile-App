import api from './client';

// Maps 1:1 to backend/src/routes/notificationRoutes.js
export const notificationApi = {
  getMine: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  remove: (id) => api.delete(`/notifications/${id}`),
};
