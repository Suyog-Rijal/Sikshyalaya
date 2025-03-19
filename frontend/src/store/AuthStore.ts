import { create } from "zustand";

type AuthStore = {
    user: { email: string | null; name: string | null } | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, name: string, token: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    checkAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    login: (email, name, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ email, name }));
        set({
            user: { email, name },
            token,
            isLoading: false,
        });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isLoading: false });
    },
    setLoading: (loading) => set({ isLoading: loading }),
    checkAuth: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            set({
                user: JSON.parse(user),
                token,
                isLoading: false,
            });
        } else {
            set({
                user: null,
                token: null,
                isLoading: false,
            });
        }
    },
}));
