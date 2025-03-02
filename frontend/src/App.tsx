import {DashboardLayout} from "@/layouts/DashboardLayout.tsx";
// import {AddStaff} from "@/components/Views/AddStaff.tsx";
// import {BrowserRouter, Route, Routes} from "react-router-dom";
// import {Dashboard} from "@/views/admin/Dashboard.tsx";
import {TeacherView} from "@/views/admin/TeacherView.tsx";

function App() {
    return (
        // <BrowserRouter>
        //     <DashboardLayout>
        //         <Routes>
        //             <Route index element={<Dashboard />} />
        //             <Route path="/list/teachers" element={<AddStaff />} />
        //         </Routes>
        //     </DashboardLayout>
        // </BrowserRouter>

        <DashboardLayout>
            <TeacherView />
        </DashboardLayout>

    )
}

export default App
