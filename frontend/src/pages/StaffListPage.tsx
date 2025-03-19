import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import { PlusCircle } from "lucide-react"
import { StaffCard } from "@/components/ListPage/StaffCard.tsx"
import { FilterBar } from "@/components/ListPage/FilterBar.tsx"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import { toast } from "sonner"
import { StaffCardSkeletonShimmerV4 } from "@/components/ListPage/StaffCardSkeleton.tsx"

export function StaffListPage() {
    const navigate = useNavigate()

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
        { label: "Disabled", value: "disabled" },
    ]

    const [apiData, setApiData] = useState<{
        id: string
        account_status: "A" | "I" | "D"
        first_name: string
        last_name: string
        position_detail: Record<string, string>
        email: string
        phone_number: string
        profile_picture: string
        staff_type: "T" | "M"
        created_at: string
    }[]>([])

    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [sortOrder, setSortOrder] = useState("name_asc")

    useEffect(() => {
        AxiosInstance.get("/api/staff/")
            .then((response) => {
                setApiData(response.data)
            })
            .catch((error) => {
                console.error(error)
                toast.error("Failed to fetch staff members")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    // Filtering logic
    const filteredStaff = apiData.filter((staff) => {
        const fullName = `${staff.first_name} ${staff.last_name}`.toLowerCase()
        const searchMatch = fullName.includes(searchText.toLowerCase())

        let statusMatch = true
        if (filterStatus === "active") {
            statusMatch = staff.account_status === "A"
        } else if (filterStatus === "inactive") {
            statusMatch = staff.account_status === "I"
        } else if (filterStatus === "disabled") {
            statusMatch = staff.account_status === "D"
        }

        return searchMatch && statusMatch
    })

    // Sorting logic
    const sortedStaff = [...filteredStaff].sort((a, b) => {
        if (sortOrder === "name_asc") return a.first_name.localeCompare(b.first_name)
        if (sortOrder === "name_desc") return b.first_name.localeCompare(a.first_name)
        if (sortOrder === "date_desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        if (sortOrder === "date_asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        return 0
    })

    return (
        <div className="p-4 flex flex-col gap-4 bg-gray-50">
            <div>
                <PageHeader
                    title="Staff Members"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Staff", href: "/staff/list/" },
                    ]}
                    onRefresh={() => console.log("Refreshing...")}
                    onPrint={() => console.log("Printing...")}
                    onExport={() => console.log("Exporting...")}
                    primaryAction={{
                        label: "Add Staff",
                        onClick: () => navigate("/staff/add/"),
                        icon: <PlusCircle className="h-4 w-4" />,
                    }}
                />

                <FilterBar
                    title="Staff Grid"
                    onViewChange={(view) => console.log("View changed to:", view)}
                    onSortChange={(sort) => setSortOrder(sort)}
                    onFilterChange={(filter) => setFilterStatus(filter)}
                    onSearchChange={(text) => setSearchText(text)}
                    sortOptions={sortOptions}
                    filterOptions={filterOptions}
                    defaultView="grid"
                />
            </div>

            <div className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading
                    ? Array.from({ length: 8 }).map((_, index) => <StaffCardSkeletonShimmerV4 key={index} />)
                    : sortedStaff.map((staff, index) => (
                        <StaffCard
                            key={index}
                            id={staff.id}
                            name={staff.first_name + " " + staff.last_name}
                            email={staff.email}
                            phone={staff.phone_number}
                            positionDetail={staff.position_detail}
                            status={staff.account_status}
                            avatarUrl={staff.profile_picture}
                            staffType={staff.staff_type}
                        />
                    ))}
            </div>
        </div>
    )
}
