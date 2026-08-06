import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { tokenStorage } from '../storage/tokenStorage';

/**
 * Central Axios instance for the mobile app — the direct native equivalent
 * of frontend/src/services/api.js on the web app, hitting the exact same
 * backend and endpoints.
 *
 * Difference from web: the web client relies on an httpOnly refresh-token
 * cookie, which native apps cannot read or send automatically. Instead,
 * the backend now also returns `refreshToken` in the JSON body on
 * login/register/refresh (see backend/src/controllers/authController.js
 * and firebaseAuthController.js), and this client stores that token in
 * Expo SecureStore and sends it explicitly as `{ refreshToken }` in the
 * body of POST /auth/refresh. Every other behavior (interceptor flow,
 * single-flight refresh + request queue, 401 handling) mirrors the web
 * client as closely as possible.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// In-memory cache to avoid an async SecureStore read on every request;
// kept in sync with SecureStore by setTokens()/clearTokens() below.
let accessTokenCache = null;

export const setAccessTokenCache = (token) => {
  accessTokenCache = token;
};

api.interceptors.request.use(async (config) => {
  const token = accessTokenCache ?? (await tokenStorage.getAccessToken());
  accessTokenCache = token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

// Set by AuthContext so the interceptor can clear session state on a
// failed refresh (e.g. refresh token expired/revoked) without importing
// the context here and creating a circular dependency.
let onAuthExpired = () => {};
export const setOnAuthExpired = (fn) => {
  onAuthExpired = fn;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token stored');

        const { data } = await api.post('/auth/refresh', { refreshToken });
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        accessTokenCache = newAccessToken;
        await tokenStorage.setAccessToken(newAccessToken);
        if (newRefreshToken) await tokenStorage.setRefreshToken(newRefreshToken);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        accessTokenCache = null;
        await tokenStorage.clearAll();
        onAuthExpired();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
