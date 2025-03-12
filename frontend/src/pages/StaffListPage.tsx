import {PageHeader} from "@/components/ListPage/PageHeader.tsx";
import {PlusCircle} from "lucide-react";
import {TeacherCard} from "@/components/ListPage/TeacherCard.tsx";
import {FilterBar} from "@/components/ListPage/FilterBar.tsx";
import {useNavigate} from "react-router-dom";

export function StaffListPage() {
    const navigate = useNavigate();
    const sortOptions = [
        { label: "Name A to Z", value: "name_asc" },
        { label: "Name Z to A", value: "name_desc" },
        { label: "Newest First", value: "date_desc" },
        { label: "Oldest First", value: "date_asc" },
    ]

    const filterOptions = [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
    ]

    return (
        <div className={'p-4 flex flex-col gap-4'}>
            <div>
                <PageHeader
                    title="Staffs"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Peoples", href: "/peoples" },
                        { label: "Staff Grid" },
                    ]}
                    onRefresh={() => console.log("Refreshing...")}
                    onPrint={() => console.log("Printing...")}
                    onExport={() => console.log("Exporting...")}
                    primaryAction={{
                        label: "Add Staff",
                        onClick: () => navigate('/api/academic/add-staff/'),
                        icon: <PlusCircle className="h-4 w-4" />,
                    }}
                />

                <FilterBar
                    title="Students Grid"
                    onViewChange={(view) => console.log("View changed to:", view)}
                    onDateRangeChange={(range) => console.log("Date range:", range)}
                    onSortChange={(sort) => console.log("Sort changed to:", sort)}
                    onFilterChange={(filter) => console.log("Filter changed to:", filter)}
                    sortOptions={sortOptions}
                    filterOptions={filterOptions}
                    defaultView="grid"
                />

            </div>
            <div className={'grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'}>
                <TeacherCard
                    id={"#301"}
                    name={"Sarah Johnson"}
                    className={"Grade 10 - Science"}
                    email={"sarah.johnson@example.com"}
                    phone={"9876543210"}
                    subject={"Physics"}
                    status={"active"}
                />

                <TeacherCard
                    id={"#302"}
                    name={"Mark Williams"}
                    className={"Grade 9 - Mathematics"}
                    email={"mark.williams@example.com"}
                    phone={"8765432109"}
                    subject={"Algebra"}
                    status={"inactive"}
                />

                <TeacherCard
                    id={"#303"}
                    name={"Emily Davis"}
                    className={"Grade 11 - English"}
                    email={"emily.davis@example.com"}
                    phone={"7654321098"}
                    subject={"Literature"}
                    status={"active"}
                />

                <TeacherCard
                    id={"#304"}
                    name={"James Miller"}
                    className={"Grade 8 - Social Studies"}
                    email={"james.miller@example.com"}
                    phone={"6543210987"}
                    subject={"History"}
                    status={"active"}
                />


            </div>
        </div>
    );
}