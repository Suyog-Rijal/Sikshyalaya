import { DashboardLayout } from "@/layouts/DashboardLayout.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
// import LoginPage from "./views/root/Login";
// import { useAuthStore } from "@/store/AuthStore.ts";
// import { useEffect } from "react";

function App() {
    // const checkAuth = useAuthStore((state) => state.checkAuth);
    // const user = useAuthStore((state) => state.user);
    //
    // useEffect(() => {
    //     checkAuth();
    // }, [checkAuth]);

    return (
        <BrowserRouter>
            {/*{!user ? (*/}
            {/*    <Routes>*/}
            {/*        <Route path="/" element={<LoginPage />} />*/}
            {/*        <Route path="*" element={<Navigate to="/" replace />} />*/}
            {/*    </Routes>*/}
            {/*) : (*/}
                <DashboardLayout>
                    <Routes>
                        <Route index element={<Dashboard />} />

                        <Route path="/student/list/" element={<StudentListPage />} />
                        <Route path="/student/add" element={<AddStudent />} />

                        <Route path="/staff/add" element={<AddStaff />} />
                        <Route path="/staff/list/" element={<StaffListPage />} />
                        <Route path="/staff/detail/:id" element={<StaffDetailPage />} />

                        <Route path="/parent/list/" element={<ParentListPage />} />

                        <Route path="/classes/list/" element={<ClassListPage />} />

                        <Route path="/subject/list/" element={<SubjectListPage />} />

                        <Route path={'/routine/list/'} element={<RoutineListPage />} />
                    </Routes>
                </DashboardLayout>
            {/*)}*/}
        </BrowserRouter>
    );
}

export default App;
