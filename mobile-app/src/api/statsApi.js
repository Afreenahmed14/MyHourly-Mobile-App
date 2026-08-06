import api from './client';

// Maps to backend/src/routes/statsRoutes.js — public platform totals.
export const statsApi = {
  getPlatformStats: () => api.get('/stats'),
};
