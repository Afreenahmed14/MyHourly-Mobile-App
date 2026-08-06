import * as SecureStore from 'expo-secure-store';

/**
 * Wraps Expo SecureStore for the two tokens the app needs to persist
 * across app restarts. Mirrors the web app's localStorage token handling
 * (services/api.js on web), but uses the OS keychain/keystore instead,
 * which is the appropriate secure-storage primitive on native.
 *
 * Keys are kept short/simple; SecureStore requires alphanumeric + . _ - only.
 */
const ACCESS_TOKEN_KEY = 'hr_access_token';
const REFRESH_TOKEN_KEY = 'hr_refresh_token';

export const tokenStorage = {
  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async setAccessToken(token) {
    if (token) {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    }
  },
  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },
  async setRefreshToken(token) {
    if (token) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }
  },
  async clearAll() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
