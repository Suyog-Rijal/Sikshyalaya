import { DashboardLayout } from "@/layouts/DashboardLayout.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import { Dashboard } from "@/views/admin/Dashboard.tsx";
import { AddStudent } from "@/pages/AddStudent.tsx";
import { StaffListPage } from "@/pages/StaffListPage.tsx";
import { AddStaff } from "@/pages/AddStaff.tsx";
import { StaffDetailPage } from "@/pages/StaffDetailPage.tsx";
import { StudentListPage } from "@/pages/StudentListPage.tsx";
import { ClassListPage } from "@/pages/ClassListPage.tsx";
import { SubjectListPage } from "@/pages/SubjectListPage.tsx";
import { ParentListPage } from "@/pages/ParentListPage.tsx";
import {RoutineListPage} from "@/pages/RoutineListPage.tsx";
import {useAuthStore} from "@/store/AuthStore.ts";
import {useEffect} from "react";
import LoginForm from "@/pages/Login.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";

function App() {
    const checkAuth = useAuthStore((s) => s.checkAuth);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <BrowserRouter>
            {!isAuthenticated ? (
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            ) : (
                <DashboardLayout>
                    <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="/student/list" element={<StudentListPage />} />
                        <Route path="/student/add" element={<AddStudent />} />
                        <Route path="/staff/add" element={<AddStaff />} />
                        <Route path="/staff/list" element={<StaffListPage />} />
                        <Route path="/staff/detail/:id" element={<StaffDetailPage />} />
                        <Route path="/parent/list" element={<ParentListPage />} />
                        <Route path="/classes/list" element={<ClassListPage />} />
                        <Route path="/subject/list" element={<SubjectListPage />} />
                        <Route path="/routine/list" element={<RoutineListPage />} />
                    </Routes>
                </DashboardLayout>
            )}
            <Toaster />
        </BrowserRouter>
    );
}

export default App;
