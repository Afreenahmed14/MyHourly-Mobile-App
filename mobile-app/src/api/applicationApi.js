import api from './client';

// Maps 1:1 to backend/src/routes/applicationRoutes.js
export const applicationApi = {
  apply: (jobId, coverLetter) => api.post('/applications', { jobId, coverLetter }),
  getMine: () => api.get('/applications/me'),
  withdraw: (id) => api.delete(`/applications/${id}`),
  getForJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
};
