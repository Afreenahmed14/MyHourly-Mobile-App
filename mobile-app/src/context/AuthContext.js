import { createContext, useCallback, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { notificationApi } from '../api/notificationApi';
import { tokenStorage } from '../storage/tokenStorage';
import { setAccessTokenCache, setOnAuthExpired } from '../api/client';

export const AuthContext = createContext(null);

const REGISTER_FN = {
  candidate: authApi.registerCandidate,
  company: authApi.registerCompany,
};

const LOGIN_FN = {
  candidate: authApi.loginCandidate,
  company: authApi.loginCompany,
  admin: authApi.loginAdmin,
};

const FIREBASE_LOGIN_FN = {
  candidate: authApi.firebaseCandidate,
  company: authApi.firebaseCompany,
  admin: authApi.firebaseAdmin,
};

/**
 * Native port of frontend/src/context/AuthContext.jsx. Same public shape
 * (user, role, isAuthenticated, loading, register/login/loginWithFirebase/
 * logout/refreshUser) so screens read the same way the web pages do.
 *
 * Session persistence: on mount, if tokens were saved from a previous app
 * session (Expo SecureStore), verify them via GET /auth/me — same "don't
 * lose login on restart" behavior as the web app's page-refresh handling.
 */
async function persistSession({ user, accessToken, refreshToken }) {
  setAccessTokenCache(accessToken);
  await tokenStorage.setAccessToken(accessToken);
  if (refreshToken) await tokenStorage.setRefreshToken(refreshToken);
  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(async () => {
    setAccessTokenCache(null);
    await tokenStorage.clearAll();
    setUser(null);
  }, []);

  const loadCurrentUser = useCallback(async () => {
    const existingToken = await tokenStorage.getAccessToken();
    if (!existingToken) {
      setLoading(false);
      return;
    }
    setAccessTokenCache(existingToken);
    try {
      const res = await authApi.getMe();
      setUser(res.data.data.user);
    } catch {
      await clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  // Wire the axios client's 401-after-failed-refresh callback to clear
  // local session state (native equivalent of the web app's
  // 'auth:sessionExpired' window event).
  useEffect(() => {
    setOnAuthExpired(() => setUser(null));
  }, []);

  const register = async (role, payload) => {
    const res = await REGISTER_FN[role](payload);
    const user = await persistSession(res.data.data);
    setUser(user);
    return user;
  };

  const login = async (role, payload) => {
    const res = await LOGIN_FN[role](payload);
    const user = await persistSession(res.data.data);
    setUser(user);
    return user;
  };

  const loginWithFirebase = async (role, idToken, extra = {}, createIfMissing = true) => {
    const res = await FIREBASE_LOGIN_FN[role](idToken, extra, createIfMissing);
    const user = await persistSession(res.data.data);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await notificationApi.clearPushToken();
    } catch {
      // Non-fatal — proceed with logout even if this device's token
      // couldn't be cleared server-side.
    }
    try {
      await authApi.logout();
    } finally {
      await clearSession();
    }
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    register,
    login,
    loginWithFirebase,
    logout,
    refreshUser: loadCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
