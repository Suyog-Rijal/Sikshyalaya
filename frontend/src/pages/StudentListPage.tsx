import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import { PlusCircle } from "lucide-react"
import { FilterBar } from "@/components/ListPage/FilterBar.tsx"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import { toast } from "sonner"
import { StudentCard } from "@/components/ListPage/StudentCard.tsx"
import { StudentCardSkeleton } from "@/components/ListPage/StudentCardSkeleton.tsx"

export function StudentListPage() {
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
        gender: string
        roll_number: string
        last_name: string
        email: string
        profile_picture: string
        school_class: string
        section: string
        created_at: string
    }[]>([])

    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [sortOrder, setSortOrder] = useState("name_asc")

    useEffect(() => {
        AxiosInstance.get("/api/student/")
            .then((response) => {
                setApiData(response.data)
            })
            .catch((error) => {
                console.error(error)
                toast.error("Failed to fetch students")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    // Filtering logic
    const filteredStudents = apiData.filter((student) => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase()
        const searchMatch = fullName.includes(searchText.toLowerCase())

        let statusMatch = true
        if (filterStatus === "active") {
            statusMatch = student.account_status === "A"
        } else if (filterStatus === "inactive") {
            statusMatch = student.account_status === "I"
        } else if (filterStatus === "disabled") {
            statusMatch = student.account_status === "D"
        }

        return searchMatch && statusMatch
    })

    // Sorting logic
    const sortedStudents = [...filteredStudents].sort((a, b) => {
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
                        onClick: () => navigate("/student/add/"),
                        icon: <PlusCircle className="h-4 w-4" />,
                    }}
                />
                <FilterBar
                    title="Student Grid"
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
                    ? Array.from({ length: 8 }).map((_, index) => <StudentCardSkeleton key={index} />)
                    : sortedStudents.map((each, index) => (
                        <StudentCard
                            id={each.id}
                            key={index}
                            name={each.first_name + " " + each.last_name}
                            email={each.email}
                            avatarUrl={each.profile_picture}
                            rollNo={each.roll_number}
                            gender={each.gender}
                            status={each.account_status}
                            schoolClass={each.school_class}
                            section={each.section}
                        />
                    ))}
            </div>
        </div>
    )
}
