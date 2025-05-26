import { create } from 'zustand';

const API_BASE = "http://localhost:8000";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    role: string | null;
    full_name: string | null;
    profile_picture?: string | null;
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
    full_name: null,
    profile_picture: null,
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
            localStorage.setItem('full_name', data.full_name);
            if (data.profile_picture) {
                localStorage.setItem('profile_picture', data.profile_picture);
            }
            set({
                accessToken: data.access,
                refreshToken: data.refresh,
                role: data.role,
                isAuthenticated: true,
                full_name: data.full_name,
                profile_picture: data.profile_picture || null,
            });
        } finally {
            set({ isLoading: false });
        }
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('full_name');
        localStorage.removeItem('profile_picture');
        set({ accessToken: null, refreshToken: null, role: null, isAuthenticated: false, full_name: null });
    },
    checkAuth: () => {
        const access = localStorage.getItem('accessToken');
        const refresh = localStorage.getItem('refreshToken');
        const role = localStorage.getItem('role');
        if (access && refresh && role) {
            set({
                accessToken: access,
                refreshToken: refresh,
                role,
                isAuthenticated: true,
                full_name: localStorage.getItem('full_name'),
                profile_picture: localStorage.getItem('profile_picture') || null,
            });
        }
    },
}));
