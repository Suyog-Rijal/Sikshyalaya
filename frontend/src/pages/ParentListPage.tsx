import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import { PlusCircle } from "lucide-react"
import { FilterBar } from "@/components/ListPage/FilterBar.tsx"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import { toast } from "sonner"
import { StudentCardSkeleton } from "@/components/ListPage/StudentCardSkeleton.tsx"
import { ParentCard } from "@/components/ListPage/ParentCard.tsx"
import { format } from "date-fns"


export function ParentListPage() {
    const navigate = useNavigate()
    const sortOptions = [
        { label: "Name A to Z", value: "name_asc" },
        { label: "Name Z to A", value: "name_desc" },
        { label: "Newest First", value: "date_desc" },
        { label: "Oldest First", value: "date_asc" },
    ]
    const filterOptions = [
        { label: "All", value: "all" },
        { label: "With Children", value: "with_children" },
        { label: "Without Children", value: "without_children" },
    ]

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return format(date, "MMMM dd, yyyy")
    }

    const [apiData, setApiData] = useState<{
        id: string
        full_name: string
        email: string
        phone_number: string
        profile_picture: string | null
        created_at: string
        guardian_of: {
            id: string
            full_name: string
            profile_picture: string | null
        }[]
    }[]>([])

    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [sortOrder, setSortOrder] = useState("name_asc")

    useEffect(() => {
        AxiosInstance.get("/api/parent/") // Changed to correct API endpoint
            .then((response) => {
                setApiData(response.data)
            })
            .catch((error) => {
                console.error(error)
                toast.error("Failed to fetch parents")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    // Filtering logic
    const filteredParents = apiData.filter((parent) => {
        const fullName = parent.full_name.toLowerCase();
        const childrenNames = parent.guardian_of.map(child => child.full_name.toLowerCase());

        const searchMatch =
            fullName.includes(searchText.toLowerCase()) ||
            childrenNames.some(childName => childName.includes(searchText.toLowerCase()));

        let statusMatch = true;
        if (filterStatus === "with_children") {
            statusMatch = parent.guardian_of.length > 0;
        } else if (filterStatus === "without_children") {
            statusMatch = parent.guardian_of.length === 0;
        }

        return searchMatch && statusMatch;
    });


    // Sorting logic
    const sortedParents = [...filteredParents].sort((a, b) => {
        if (sortOrder === "name_asc") return a.full_name.localeCompare(b.full_name)
        if (sortOrder === "name_desc") return b.full_name.localeCompare(a.full_name)
        if (sortOrder === "date_desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        if (sortOrder === "date_asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        return 0
    })

    return (
        <div className="p-4 flex flex-col gap-4 bg-gray-50">
            <div>
                <PageHeader
                    title="Parents"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Parents", href: "/parents/list/" },
                    ]}
                    onRefresh={() => console.log("Refreshing...")}
                    onPrint={() => console.log("Printing...")}
                    onExport={() => console.log("Exporting...")}
                    primaryAction={{
                        label: "Add Parent",
                        onClick: () => navigate("/parent/add/"),
                        icon: <PlusCircle className="h-4 w-4" />,
                    }}
                />
                <FilterBar
                    title="Parent List"
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
                    : sortedParents.map((each, index) => (
                        <ParentCard
                            key={index}
                            id={each.id}
                            name={each.full_name}
                            email={each.email}
                            phone={each.phone_number}
                            addedDate={formatDate(each.created_at)} // Format here
                            avatarUrl={each.profile_picture ?? undefined}
                            student={each.guardian_of.map(child => ({
                                id: child.id,
                                name: child.full_name,
                                avatarUrl: child.profile_picture ?? undefined
                            })) ?? undefined}
                            onViewDetails={(id) => console.log(`View details for ${id}`)}
                        />
                    ))}
            </div>
        </div>
    )
}
