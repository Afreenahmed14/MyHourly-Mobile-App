import api from './client';

// Maps 1:1 to backend/src/routes/subscriptionRoutes.js
export const subscriptionApi = {
  getPlans: (forRole) => api.get('/subscription/plans', { params: forRole ? { for: forRole } : {} }),
  getStatus: () => api.get('/subscription/status'),
  createOrder: (product, tier) => api.post('/subscription/order', { product, tier }),
  verifyPayment: (payload) => api.post('/subscription/verify', payload),
  cancel: () => api.post('/subscription/cancel'),
};
