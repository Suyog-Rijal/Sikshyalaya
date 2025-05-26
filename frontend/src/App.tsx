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
import AttendanceListPage from "@/pages/AdminAttendance.tsx";
import {TeacherRoutineList} from "@/views/teacher/TeacherRoutineList.tsx";
import TeacherAttendanceList from "@/views/teacher/TeacherAttendanceList.tsx";
import AddAttendancePage from "@/views/teacher/AddAttendance.tsx";
import TeacherAssignmentDetailPage from "@/views/teacher/TeacherAssignmentDetailPage.tsx";
import TeacherAssignmentList from "@/views/teacher/TeacherAssignmentList.tsx";

import TeacherAssignmentEdit from "@/views/teacher/TeacherAssignmentEdit.tsx";
import Chat from "@/pages/Chat.tsx";
import AdminAnnouncementPage from "@/views/admin/AdminAnnouncement.tsx";
import {ExamRoutinesPage} from "@/pages/Exam.tsx";
import {LeavePage} from "@/components/Dashboard/Leave.tsx";

import {StudentLeave} from "@/views/student/StudentLeave.tsx";
import StudentProfilePage from "@/views/student/StudentProfile.tsx";
import Fees from "@/views/admin/Fees.tsx";
import {StudentDetailPage} from "@/views/student/StudentDetail.tsx";
import AdminFeesDashboard from "@/pages/AdminFees.tsx";
import {EditStaff} from "@/views/admin/EditStaff.tsx";
import {ClassDetailPage} from "@/views/admin/ClassDetail.tsx";
import {ParentDetailPage} from "@/pages/ParentDetailPage.tsx";
import ParentAttendance from "@/views/parent/ParentAttendance.tsx";

import SubmissionPage from "@/views/student/StudentAssignment.tsx";

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
                            <Route path={'/staff/detail/:id'} element={<StaffDetailPage />} />
                            <Route path={'/staff/edit/:id'} element={<EditStaff />} />

                            <Route path="/student/list" element={<StudentListPage />} />
                            <Route path="/student/add" element={<AddStudent />} />
                            <Route path={'/students/detail/:id'} element={<StudentDetailPage />} />

                            <Route path="/classes/list" element={<ClassListPage />} />
                            <Route path="/class/:id" element={<ClassDetailPage />} />

                            <Route path="/subject/list" element={<SubjectListPage />} />
                            <Route path="/routine/list" element={<RoutineListPage />} />

                            <Route path="/parent/list" element={<ParentListPage />} />
                            <Route path="/parent/detail/:id" element={<ParentDetailPage />} />

                            <Route path="/list/attendance" element={<AttendanceListPage />} />

                            <Route path="/assignment/list" element={<TeacherAssignmentList />} />
                            <Route path="/assignment/detail/:id" element={<TeacherAssignmentDetailPage />} />

                            <Route path={'/messages'} element={<Chat />} />
                            <Route path={'announcement/list'} element={<AdminAnnouncementPage />} />
                            <Route path={'leave/'} element={<LeavePage />} />

                            <Route path={'exam/list'} element={<ExamRoutinesPage />} />

                            <Route path={'fees/'} element={<Fees />} />
                            <Route path="/logout" element={<Logout />} />
                        </Routes>
                    </DashboardLayout>
                );
            case "teacher":
                return (
                    <DashboardLayout>
                        <Routes>
                            <Route index element={<TeacherStudentList />} />

                            <Route path="/student/list" element={<TeacherStudentList />} />
                            <Route path={'/students/detail/:id'} element={<StudentDetailPage />} />

                            <Route path="/routine/list" element={<TeacherRoutineList />} />

                            <Route path="/subject/list" element={<SubjectListPage />} />
                            <Route path="/list/attendance" element={<TeacherAttendanceList />} />
                            <Route path="/attendance/session/create" element={<AddAttendancePage />} />

                            <Route path="/assignment/list" element={<TeacherAssignmentList />} />
                            <Route path="/assignment/detail/:id" element={<TeacherAssignmentDetailPage />} />s
                            <Route path={'/assignment/edit/:id'} element={<TeacherAssignmentEdit />} />

                            <Route path={'/announcement/list'} element={<AdminAnnouncementPage />} />

                            <Route path={'/exam/list'} element={<ExamRoutinesPage />} />

                            <Route path={'/leave'} element={<LeavePage />} />

                            <Route path={'/messages'} element={<Chat />} />
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
                            <Route path="/student/list" element={<StudentListPage />} />
                            <Route path="/student/add" element={<AddStudent />} />
                            <Route path={'/fees'} element={<AdminFeesDashboard />} />

                            <Route path="/logout" element={<Logout />} />
                        </Routes>
                    </DashboardLayout>
                );
            case "student":
                return (
                    <DashboardLayout>
                        <Routes>
                            <Route index element={<RoutineListPage />} />
                            <Route path="/routine/list" element={<RoutineListPage />} />

                            <Route path="/subject/list" element={<SubjectListPage />} />

                            <Route path={'/exam/list'} element={<ExamRoutinesPage />} />

                            <Route path="/assignment/list" element={<TeacherAssignmentList />} />
                            <Route path="/assignment/detail/:id" element={<SubmissionPage />} />s

                            <Route path={"/leave"} element={<StudentLeave />} />

                            <Route path={'/announcement/list'} element={<AdminAnnouncementPage />} />

                            <Route path={'/list/attendance'} element={<TeacherAttendanceList />} />
                            <Route path={'/profile'} element={<StudentProfilePage />} />
                            <Route path={'/messages'} element={<Chat />} />

                            <Route path="/logout" element={<Logout />} />
                        </Routes>
                    </DashboardLayout>
                );
            case "parent":
                return (
                    <DashboardLayout>
                        <Routes>
                            <Route index element={<SubjectListPage />} />
                            <Route path="/subject/list" element={<SubjectListPage />} />
                            <Route path={"/exam/list"} element={<ExamRoutinesPage />} />
                            <Route path={"/leave"} element={<StudentLeave />} />

                            <Route path={'/announcement/list'} element={<AdminAnnouncementPage />} />

                            <Route path={'/list/attendance'} element={<ParentAttendance />} />

                            <Route path={'/profile'} element={<StudentProfilePage />} />
                            <Route path={'/messages'} element={<Chat />} />
                            <Route path={'fees/'} element={<Fees />} />

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
