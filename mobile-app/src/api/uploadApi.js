import api from './client';

// Maps 1:1 to backend/src/routes/uploadRoutes.js
export const uploadApi = {
  uploadCertificate: (formData) =>
    api.post('/uploads/certificate', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCertificate: (certId) => api.delete(`/uploads/certificate/${certId}`),
  uploadVerificationDocument: (formData) =>
    api.post('/uploads/verification-document', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
