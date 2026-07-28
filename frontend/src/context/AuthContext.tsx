import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../api/authService';
import { getAccessToken } from '../api/client';

type Role = 'candidate' | 'company' | 'admin' | null;

type AuthContextType = {
  user: any | null;
  role: Role;
  isLoading: boolean;
  loginCandidate: (email: string, password: string) => Promise<void>;
  loginCompany: (email: string, password: string) => Promise<void>;
  registerCandidate: (payload: any) => Promise<void>;
  registerCompany: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      if (token) {
        try {
          const me = await authService.getMe();
          setUser(me);
          setRole(me?.role ?? null);
        } catch {
          // token invalid/expired and refresh failed — stay logged out
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const loginCandidate = async (email: string, password: string) => {
    const u = await authService.loginCandidate({ email, password });
    setUser(u);
    setRole('candidate');
  };

  const loginCompany = async (email: string, password: string) => {
    const u = await authService.loginCompany({ email, password });
    setUser(u);
    setRole('company');
  };

  const registerCandidate = async (payload: any) => {
    const u = await authService.registerCandidate(payload);
    setUser(u);
    setRole('candidate');
  };

  const registerCompany = async (payload: any) => {
    const u = await authService.registerCompany(payload);
    setUser(u);
    setRole('company');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setRole(null);
  };

  const refreshUser = async () => {
    const me = await authService.getMe();
    setUser(me);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        loginCandidate,
        loginCompany,
        registerCandidate,
        registerCompany,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
