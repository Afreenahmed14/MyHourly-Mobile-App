import api from './client';

// Maps 1:1 to backend/src/routes/taxonomyRoutes.js — public reference data.
export const taxonomyApi = {
  getSkills: () => api.get('/taxonomy/skills'),
  getCategories: () => api.get('/taxonomy/categories'),
  getDeveloperTypes: () => api.get('/taxonomy/developer-types'),
};
