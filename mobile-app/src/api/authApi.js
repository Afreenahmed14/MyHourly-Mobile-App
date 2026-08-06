import api from './client';

/**
 * Maps 1:1 to backend/src/routes/authRoutes.js. No endpoints invented,
 * none renamed — same routes the web app's services/authService.js calls.
 */
export const authApi = {
  registerCandidate: (payload) => api.post('/auth/candidate/register', payload),
  registerCompany: (payload) => api.post('/auth/company/register', payload),

  loginCandidate: (payload) => api.post('/auth/candidate/login', payload),
  loginCompany: (payload) => api.post('/auth/company/login', payload),
  loginAdmin: (payload) => api.post('/auth/admin/login', payload),

  // extra: { hourlyRate } for candidate, { companyName } for company,
  // only used on first sign-in (account creation). createIfMissing: false
  // is sent from Login screens so "Continue with Google" on Login never
  // silently creates an account (matches web behavior).
  firebaseCandidate: (idToken, extra = {}, createIfMissing = true) =>
    api.post('/auth/candidate/firebase', { idToken, ...extra, createIfMissing }),
  firebaseCompany: (idToken, extra = {}, createIfMissing = true) =>
    api.post('/auth/company/firebase', { idToken, ...extra, createIfMissing }),
  firebaseAdmin: (idToken) => api.post('/auth/admin/firebase', { idToken }),

  logout: () => api.post('/auth/logout'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};
