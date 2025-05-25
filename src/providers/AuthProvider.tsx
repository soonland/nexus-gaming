'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';

import type { IAuthUser, ILoginCredentials } from '@/types/auth';

interface IAuthContextType {
  user: IAuthUser | null;
  isLoading: boolean;
  isError: boolean;
  login: (credentials: ILoginCredentials, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContextType>({
  user: null,
  isLoading: true,
  isError: false,
  login: async () => {
    throw new Error('AuthContext not initialized: login()');
  },
  logout: async () => {
    throw new Error('AuthContext not initialized: logout()');
  },
  refresh: async () => {
    throw new Error('AuthContext not initialized: refresh()');
  },
});

interface IAuthState {
  user: IAuthUser | null;
  isLoading: boolean;
  isError: boolean;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<IAuthState>({
    user: null,
    isLoading: true,
    isError: false,
  });
  const router = useRouter();

  const login = useCallback(
    async (credentials: ILoginCredentials, redirectTo?: string) => {
      setAuthState((prev: IAuthState) => ({
        ...prev,
        isLoading: true,
        isError: false,
      }));
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        setAuthState({ user: data.user, isLoading: false, isError: false });
        router.push(redirectTo || '/games');
      } catch (error) {
        console.error('Login error:', error);
        setAuthState((prev: IAuthState) => ({
          ...prev,
          isLoading: false,
          isError: true,
        }));
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setAuthState((prev: IAuthState) => ({ ...prev, isLoading: true }));
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthState({ user: null, isLoading: false, isError: false });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState((prev: IAuthState) => ({
        ...prev,
        isLoading: false,
        isError: true,
      }));
    }
  }, [router]);

  const refresh = useCallback(async () => {
    setAuthState((prev: IAuthState) => ({
      ...prev,
      isLoading: true,
      isError: false,
    }));
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setAuthState({ user: data.user, isLoading: false, isError: false });
      } else if (response.status === 401) {
        // Handle unauthorized gracefully
        setAuthState({ user: null, isLoading: false, isError: false });
      } else {
        throw new Error('Auth check failed');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState((prev: IAuthState) => ({
        ...prev,
        isLoading: false,
        isError: true,
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isLoading: authState.isLoading,
        isError: authState.isError,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
