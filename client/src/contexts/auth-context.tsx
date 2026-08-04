import { authApi } from '@/api';
import { SESSION_EXPIRED_EVENT } from '@/lib/axios';
import { tokenStorage } from '@/lib/token-storage';
import type { AuthResponse, User } from '@/types';
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (response: AuthResponse) => void;
  signOut: () => Promise<void>;
  setUser: (user: User) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => tokenStorage.getUser());
  const [isLoading, setIsLoading] = useState(() => Boolean(tokenStorage.getAccessToken()));

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setUserState(null);
  }, []);

  const signIn = useCallback((response: AuthResponse) => {
    tokenStorage.save(response.accessToken, response.refreshToken, response.user);
    setUserState(response.user);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authApi.logout(tokenStorage.getRefreshToken());
    } catch {
      // Token allaqachon yaroqsiz bo'lsa ham lokal sessiyani tozalaymiz.
    }

    clearSession();
  }, [clearSession]);

  const setUser = useCallback((next: User) => {
    tokenStorage.saveUser(next);
    setUserState(next);
  }, []);

  // Sahifa yangilanganda saqlangan token hali amal qilishini tekshiramiz.
  useEffect(() => {
    if (!tokenStorage.getAccessToken()) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    authApi
      .me()
      .then((fresh) => {
        if (!cancelled) {
          tokenStorage.saveUser(fresh);
          setUserState(fresh);
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearSession();
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, clearSession);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, clearSession);
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      isLoading,
      signIn,
      signOut,
      setUser,
    }),
    [user, isLoading, signIn, signOut, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
