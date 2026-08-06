import api from './client';

// Maps 1:1 to backend/src/routes/jobRoutes.js
export const jobApi = {
  search: (params) => api.get('/jobs/search', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getMine: () => api.get('/jobs/me'),
  create: (payload) => api.post('/jobs', payload),
  update: (id, payload) => api.put(`/jobs/${id}`, payload),
  remove: (id) => api.delete(`/jobs/${id}`),
};
