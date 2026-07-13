import { create } from 'zustand';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
    clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
}));

export default useAuthStore;
