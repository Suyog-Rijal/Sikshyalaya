import { DashboardLayout } from "@/layouts/DashboardLayout.tsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "@/views/admin/Dashboard.tsx";
import { AddStudent } from "@/pages/AddStudent.tsx";
import { StaffListPage } from "@/pages/StaffListPage.tsx";
import { AddStaff } from "@/pages/AddStaff.tsx";
import { StaffDetailPage } from "@/pages/StaffDetailPage.tsx";
import { StudentListPage } from "@/pages/StudentListPage.tsx";
import { ClassListPage } from "@/pages/ClassListPage.tsx";
import { SubjectListPage } from "@/pages/SubjectListPage.tsx";
import { ParentListPage } from "@/pages/ParentListPage.tsx";
import { RoutineListPage } from "@/pages/RoutineListPage.tsx";
import { useAuthStore } from "@/store/AuthStore.ts";
import LoginForm from "@/pages/Login.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { Logout } from "@/pages/Logout.tsx";
import { useEffect } from "react";
import {TeacherStudentList} from "@/views/teacher/TeacherStudentList.tsx";
import {TeacherParentList} from "@/views/teacher/TeacherParentList.tsx";
import AttendanceListPage from "@/pages/AdminAttendance.tsx";
import {TeacherRoutineList} from "@/views/teacher/TeacherRoutineList.tsx";
import TeacherAttendanceList from "@/views/teacher/TeacherAttendanceList.tsx";
import AddAttendancePage from "@/views/teacher/AddAttendance.tsx";
import TeacherAssignmentDetailPage from "@/views/teacher/TeacherAssignmentDetailPage.tsx";
import TeacherAssignmentList from "@/views/teacher/TeacherAssignmentList.tsx";

function App() {
    const checkAuth = useAuthStore((s) => s.checkAuth);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const role = useAuthStore((s) => s.role);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const dashboardRoutes = () => {
        switch (role) {
            case "admin":
                return (
                    <DashboardLayout>
                        <Routes>
                            <Route index element={<Dashboard />} />
                            <Route path="/staff/list" element={<StaffListPage />} />
                            <Route path="/staff/add" element={<AddStaff />} />
                            <Route path="/student/list" element={<StudentListPage />} />
                            <Route path="/student/add" element={<AddStudent />} />
                            <Route path="/classes/list" element={<ClassListPage />} />
                            <Route path="/subject/list" element={<SubjectListPage />} />
                            <Route path="/routine/list" element={<RoutineListPage />} />
                            <Route path="/parent/list" element={<ParentListPage />} />
                            <Route path="/list/attendance" element={<AttendanceListPage />} />
                            <Route path="/logout" element={<Logout />} />
                        </Routes>
                    </DashboardLayout>
                );
            case "teacher":
                return (
                    <DashboardLayout>
                        <Routes>
                            <Route index element={<Dashboard />} />
                            <Route path="/student/list" element={<TeacherStudentList />} />
                            <Route path="/parent/list" element={<TeacherParentList />} />
                            <Route path="/routine/list" element={<TeacherRoutineList />} />
                            <Route path="/subject/list" element={<SubjectListPage />} />
                            <Route path="/list/attendance" element={<TeacherAttendanceList />} />
                            <Route path="/attendance/session/create" element={<AddAttendancePage />} />
                            <Route path="/assignment/list" element={<TeacherAssignmentList />} />
                            <Route path="/assignment/detail/:id" element={<TeacherAssignmentDetailPage />} />s
                            <Route path="/logout" element={<Logout />} />
                        </Routes>
                    </DashboardLayout>
                );
            case "staff":
                return (
                    <DashboardLayout>
                        <Routes>
                            <Route index element={<Dashboard />} />
                            <Route path="/staff/detail/:id" element={<StaffDetailPage />} />
                            <Route path="/logout" element={<Logout />} />
                        </Routes>
                    </DashboardLayout>
                );
            case "student":
                return (
                    <DashboardLayout>
                        <Routes>
                            <Route index element={<Dashboard />} />
                            <Route path="/routine/list" element={<RoutineListPage />} />
                            <Route path="/subject/list" element={<SubjectListPage />} />
                            <Route path="/logout" element={<Logout />} />
                        </Routes>
                    </DashboardLayout>
                );
            case "parent":
                return (
                    <DashboardLayout>
                        <Routes>
                            <Route index element={<Dashboard />} />
                            <Route path="/student/list" element={<StudentListPage />} />
                            <Route path="/logout" element={<Logout />} />
                        </Routes>
                    </DashboardLayout>
                );
            default:
                return <Navigate to="/" replace />;
        }
    };

    return (
        <BrowserRouter>
            {!isAuthenticated ? (
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            ) : (
                dashboardRoutes()
            )}
            <Toaster />
        </BrowserRouter>
    );
}

export default App;
