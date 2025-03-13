import {PageHeader} from "@/components/ListPage/PageHeader.tsx";
import {PlusCircle} from "lucide-react";
import {StaffCard} from "@/components/ListPage/StaffCard.tsx";
import {FilterBar} from "@/components/ListPage/FilterBar.tsx";
import {StudentCard} from "@/components/ListPage/StudentCard.tsx";

export function ListPage() {
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
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Peoples", href: "/peoples" },
                        { label: "Students Grid" },
                    ]}
                    onRefresh={() => console.log("Refreshing...")}
                    onPrint={() => console.log("Printing...")}
                    onExport={() => console.log("Exporting...")}
                    primaryAction={{
                        label: "Add Student",
                        onClick: () => console.log("Add student clicked"),
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
                <StaffCard
                    id={"#301"}
                    name={"Sarah Johnson"}
                    className={"Grade 10 - Science"}
                    email={"sarah.johnson@example.com"}
                    phone={"9876543210"}
                    subject={"Physics"}
                    status={"active"}
                />

                <StaffCard
                    id={"#302"}
                    name={"Mark Williams"}
                    className={"Grade 9 - Mathematics"}
                    email={"mark.williams@example.com"}
                    phone={"8765432109"}
                    subject={"Algebra"}
                    status={"inactive"}
                />

                <StaffCard
                    id={"#303"}
                    name={"Emily Davis"}
                    className={"Grade 11 - English"}
                    email={"emily.davis@example.com"}
                    phone={"7654321098"}
                    subject={"Literature"}
                    status={"active"}
                />

                <StaffCard
                    id={"#304"}
                    name={"James Miller"}
                    className={"Grade 8 - Social Studies"}
                    email={"james.miller@example.com"}
                    phone={"6543210987"}
                    subject={"History"}
                    status={"active"}
                />

                <StudentCard
                    id={"#201"}
                    name={"Liam Johnson"}
                    className={"Grade 10 - A"}
                    rollNo={"1001"}
                    gender={"Male"}
                    joinedOn={"2023-06-15"}
                    status={"active"}
                />

                <StudentCard
                    id={"#202"}
                    name={"Emma Williams"}
                    className={"Grade 9 - B"}
                    rollNo={"1002"}
                    gender={"Female"}
                    joinedOn={"2022-09-10"}
                    status={"inactive"}
                />

                <StudentCard
                    id={"#203"}
                    name={"Noah Smith"}
                    className={"Grade 8 - C"}
                    rollNo={"1003"}
                    gender={"Male"}
                    joinedOn={"2021-07-20"}
                    status={"active"}
                />

                <StudentCard
                    id={"#204"}
                    name={"Olivia Brown"}
                    className={"Grade 11 - A"}
                    rollNo={"1004"}
                    gender={"Female"}
                    joinedOn={"2024-01-05"}
                    status={"active"}
                />

                <StudentCard
                    id={"#205"}
                    name={"William Davis"}
                    className={"Grade 12 - B"}
                    rollNo={"1005"}
                    gender={"Male"}
                    joinedOn={"2020-08-25"}
                    status={"inactive"}
                />



            </div>
        </div>
    );
}