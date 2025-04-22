import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";

type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles: string[];
};

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const role = useAuthStore((s) => s.role);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(role as string)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};
