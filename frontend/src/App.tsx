import {DashboardLayout} from "@/layouts/DashboardLayout.tsx";
// import {Dashboard} from "@/views/student/Dashboard.tsx";
import {AddStudent} from "@/components/Views/AddStudent.tsx";
// import {AddStudent} from "@/components/Views/AddStaff.tsx";
// import {Dashboard} from "@/views/admin/Dashboard.tsx";
// import {AddStaff} from "@/views/admin/AddStaff.tsx";

function App() {
    return (
        <DashboardLayout>
            {/*<Dashboard></Dashboard>*/}
            {/*<AddStudent></AddStudent>*/}
            <AddStudent />
            {/*<Dashboard />*/}
            {/*<AddStaff />*/}
        </DashboardLayout>
    )
}

export default App
