import { create } from 'zustand';

const API_BASE = "http://localhost:8000";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    role: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, role: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    role: null,
    isAuthenticated: false,
    isLoading: false,
    login: async (email, password, role) => {
        set({ isLoading: true });
        try {
            const res = await fetch(`${API_BASE}/api/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });
            if (!res.ok) throw new Error('Invalid username or password');
            const data = await res.json();
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('role', data.role);
            set({
                accessToken: data.access,
                refreshToken: data.refresh,
                role: data.role,
                isAuthenticated: true,
            });
        } finally {
            set({ isLoading: false });
        }
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        set({ accessToken: null, refreshToken: null, role: null, isAuthenticated: false });
    },
    checkAuth: () => {
        const access = localStorage.getItem('accessToken');
        const refresh = localStorage.getItem('refreshToken');
        const role = localStorage.getItem('role');
        if (access && refresh && role) {
            set({ accessToken: access, refreshToken: refresh, role, isAuthenticated: true });
        }
    },
}));
