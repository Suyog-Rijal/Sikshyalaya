import {DashboardLayout} from "@/layouts/DashboardLayout.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Dashboard} from "@/views/admin/Dashboard.tsx";
import {AddStudent} from "@/pages/AddStudent.tsx";


function App() {
    return (
        <BrowserRouter>
            <DashboardLayout>
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="/list/students" element={<AddStudent/>} />
                </Routes>
            </DashboardLayout>
        </BrowserRouter>


    )
}

export default App
