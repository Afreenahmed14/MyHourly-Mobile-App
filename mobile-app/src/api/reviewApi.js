import api from './client';

// Maps 1:1 to backend/src/routes/reviewRoutes.js
export const reviewApi = {
  getForCandidate: (candidateId) => api.get(`/reviews/candidate/${candidateId}`),
  getForCompany: (companyId) => api.get(`/reviews/company/${companyId}`),
  create: (payload) => api.post('/reviews', payload),
  update: (id, payload) => api.put(`/reviews/${id}`, payload),
  remove: (id) => api.delete(`/reviews/${id}`),
};
