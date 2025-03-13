import {DashboardLayout} from "@/layouts/DashboardLayout.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Dashboard} from "@/views/admin/Dashboard.tsx";
import {AddStudent} from "@/pages/AddStudent.tsx";
import {ListPage} from "@/pages/ListPage.tsx";
import {StaffListPage} from "@/pages/StaffListPage.tsx";
import {AddStaff} from "@/pages/AddStaff.tsx";
import {StaffDetailPage} from "@/pages/StaffDetailPage.tsx";
import {StudentListPage} from "@/pages/StudentListPage.tsx";


function App() {
    return (
        <BrowserRouter>
            <DashboardLayout>
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="/student/list/" element={<StudentListPage/>} />
                    <Route path="/student/add" element={<AddStudent/>} />

                    <Route path="/staff/add" element={<AddStaff/>} />
                    <Route path="/staff/list/" element={<StaffListPage/>} />
                    <Route path={"/staff/detail/:id"} element={<StaffDetailPage/>} />

                    <Route path={"/list/parents"} element={<ListPage/>} />
                </Routes>
            </DashboardLayout>
        </BrowserRouter>


    )
}

export default App
