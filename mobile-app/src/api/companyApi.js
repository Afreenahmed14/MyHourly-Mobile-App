import api from './client';

// Maps 1:1 to backend/src/routes/companyRoutes.js
export const companyApi = {
  getMyProfile: () => api.get('/companies/me/profile'),
  updateMyProfile: (payload) => api.put('/companies/me/profile', payload),
  uploadLogo: (formData) =>
    api.post('/companies/me/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getBookmarks: () => api.get('/companies/me/bookmarks'),
  bookmarkCandidate: (candidateId) => api.post(`/companies/me/bookmarks/${candidateId}`),
  removeBookmark: (candidateId) => api.delete(`/companies/me/bookmarks/${candidateId}`),
  getHires: () => api.get('/companies/me/hires'),
};
