import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../features/auth/services/auth.service';
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth.types';

interface AuthState {
  currentUser: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<User | null>;
  updateUser: (user: Partial<User> | User) => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authService.login(credentials);
          localStorage.setItem('accessToken', token);
          set({
            currentUser: user,
            accessToken: token,
            isAuthenticated: true,
            isLoading: false,
          });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authService.register(credentials);
          localStorage.setItem('accessToken', token);
          set({
            currentUser: user,
            accessToken: token,
            isAuthenticated: true,
            isLoading: false,
          });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } finally {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('auth-storage');
          set({
            currentUser: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      fetchCurrentUser: async () => {
        const storedToken = get().accessToken || localStorage.getItem('accessToken');

        if (!storedToken) {
          set({
            currentUser: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return null;
        }

        set({ isLoading: true });
        try {
          const fetchedUser = await authService.getCurrentUser();
          set({
            currentUser: fetchedUser,
            isAuthenticated: true,
            isLoading: false,
          });
          return fetchedUser;
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('auth-storage');
          set({
            currentUser: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return null;
        }
      },

      updateUser: (updatedData: Partial<User> | User) => {
        set((state) => {
          const nextUser = state.currentUser
            ? { ...state.currentUser, ...updatedData }
            : (updatedData as User);
          return {
            currentUser: nextUser,
          };
        });
      },

      setAuth: (user: User, token: string) => {
        localStorage.setItem('accessToken', token);
        set({ currentUser: user, accessToken: token, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth-storage');
        set({ currentUser: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
