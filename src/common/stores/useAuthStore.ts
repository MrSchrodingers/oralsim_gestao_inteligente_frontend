import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IUser } from '../interfaces/IUser';

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  actions: {
    login: (user: IUser, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    setUser: (user: IUser | null) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      actions: {
        login: (user, accessToken, refreshToken) => {
          set({ user, accessToken, refreshToken, isAuthenticated: true });
        },
        logout: () => {
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        },
        setUser: (user) => set({ user }),
        setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export const useAuthActions = () => useAuthStore((state) => state.actions);
