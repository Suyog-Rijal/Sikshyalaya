import {DashboardLayout} from "@/layouts/DashboardLayout.tsx";
// import {Dashboard} from "@/views/student/Dashboard.tsx";
import {Dashboard} from "@/views/admin/Dashboard.tsx";

function App() {
    return (
        <DashboardLayout>
            <Dashboard></Dashboard>
        </DashboardLayout>
    )
}

export default App
