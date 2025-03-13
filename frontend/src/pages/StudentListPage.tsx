import {PageHeader} from "@/components/ListPage/PageHeader.tsx";
import {PlusCircle} from "lucide-react";
import {FilterBar} from "@/components/ListPage/FilterBar.tsx";
import {useNavigate} from "react-router-dom";

export function StudentListPage() {
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
                    title="Students"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Student", href: "/student/list/" },
                    ]}
                    onRefresh={() => console.log("Refreshing...")}
                    onPrint={() => console.log("Printing...")}
                    onExport={() => console.log("Exporting...")}
                    primaryAction={{
                        label: "Add Student",
                        onClick: () => navigate('/student/add/'),
                        icon: <PlusCircle className="h-4 w-4" />,
                    }}
                />

                <FilterBar
                    title="Staff Grid"
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

            </div>
        </div>
    );
}