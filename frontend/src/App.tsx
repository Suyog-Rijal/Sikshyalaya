import {DashboardLayout} from "@/layouts/DashboardLayout.tsx";
import {AddStudent} from "@/components/Views/AddStudent.tsx";
// import {Dashboard} from "@/views/admin/Dashboard.tsx";

function App() {
    return (
        <DashboardLayout>
            {/*<Dashboard></Dashboard>*/}
            <AddStudent></AddStudent>
        </DashboardLayout>
    )
}

export default App
