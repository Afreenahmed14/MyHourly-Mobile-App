import { api, setAccessToken, setRefreshToken } from './client';

async function storeSession(data: any) {
  await setAccessToken(data.data.accessToken);
  // Only present once the backend is updated to include it in the body
  // (see the NOTE in client.ts) — falls back gracefully if not.
  if (data.data.refreshToken) await setRefreshToken(data.data.refreshToken);
  return data.data.user;
}

export const authService = {
  async registerCandidate(payload: any) {
    const data = await api.post('/auth/candidate/register', payload);
    return storeSession(data);
  },
  async registerCompany(payload: any) {
    const data = await api.post('/auth/company/register', payload);
    return storeSession(data);
  },
  async loginCandidate(payload: { email: string; password: string }) {
    const data = await api.post('/auth/candidate/login', payload);
    return storeSession(data);
  },
  async loginCompany(payload: { email: string; password: string }) {
    const data = await api.post('/auth/company/login', payload);
    return storeSession(data);
  },
  async firebaseCandidate(idToken: string, extra: Record<string, any> = {}) {
    const data = await api.post('/auth/candidate/firebase', { idToken, ...extra });
    return storeSession(data);
  },
  async firebaseCompany(idToken: string, extra: Record<string, any> = {}) {
    const data = await api.post('/auth/company/firebase', { idToken, ...extra });
    return storeSession(data);
  },
  async getMe() {
    const data = await api.get('/auth/me');
    return data.data.user ?? data.data;
  },
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      await setAccessToken(null);
      await setRefreshToken(null);
    }
  },
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (payload: any) => api.post('/auth/reset-password', payload),
};
