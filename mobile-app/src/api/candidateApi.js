import api from './client';

// Maps 1:1 to backend/src/routes/candidateRoutes.js
export const candidateApi = {
  search: (params) => api.get('/candidates/search', { params }),
  getById: (id) => api.get(`/candidates/${id}`),
  getMyProfile: () => api.get('/candidates/me/profile'),
  updateMyProfile: (payload) => api.put('/candidates/me/profile', payload),
  deleteMyProfile: () => api.delete('/candidates/me/profile'),
  uploadResume: (formData) =>
    api.post('/candidates/me/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadProfileImage: (formData) =>
    api.post('/candidates/me/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  hire: (candidateId, payload) => api.post(`/candidates/${candidateId}/hire`, payload),
  getHiredBy: () => api.get('/candidates/me/hired-by'),
  getProjectPartners: () => api.get('/candidates/me/project-partners'),
};
