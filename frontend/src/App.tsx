import {DashboardLayout} from "@/layouts/DashboardLayout.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Dashboard} from "@/views/admin/Dashboard.tsx";
import {AddStudent} from "@/pages/AddStudent.tsx";
import {ListPage} from "@/pages/ListPage.tsx";
import {StaffListPage} from "@/pages/StaffListPage.tsx";


function App() {
    return (
        <BrowserRouter>
            <DashboardLayout>
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="/list/students" element={<AddStudent/>} />
                    <Route path="/list/teachers" element={<StaffListPage/>} />
                    <Route path={"/list/parents"} element={<ListPage/>} />
                </Routes>
            </DashboardLayout>
        </BrowserRouter>


    )
}

export default App
