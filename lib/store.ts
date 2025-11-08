/**
 * Store Zustand para gerenciar estado global de autenticação
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Interface do usuário autenticado
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  avatar?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Interface do store de autenticação
 */
interface AuthStore {
  // Estado
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Ações
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

/**
 * Store de autenticação com persistência
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Ações
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      logout: () => {
        set({ user: null, token: null, error: null });
        // Remover token do localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
      },

      isAuthenticated: () => {
        const { token, user } = get();
        return !!token && !!user;
      },
    }),
    {
      name: 'auth-storage', // Nome da chave no localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

/**
 * Hook customizado para usar o store de autenticação
 */
export function useAuth() {
  const store = useAuthStore();
  return {
    user: store.user,
    token: store.token,
    isLoading: store.isLoading,
    error: store.error,
    isAuthenticated: store.isAuthenticated(),
    setUser: store.setUser,
    setToken: store.setToken,
    setLoading: store.setLoading,
    setError: store.setError,
    logout: store.logout,
  };
}

