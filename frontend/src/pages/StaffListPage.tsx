import {PageHeader} from "@/components/ListPage/PageHeader.tsx";
import {PlusCircle} from "lucide-react";
import {StaffCard} from "@/components/ListPage/StaffCard.tsx";
import {FilterBar} from "@/components/ListPage/FilterBar.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import AxiosInstance from "@/auth/AxiosInstance.ts";
import {toast} from "sonner";

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

    const [apiData, setApiData] = useState<{
        id: string;
        account_status: 'A' | 'I' | 'D';
        first_name: string;
        last_name: string;
        position_detail: Record<string, string>,
        email: string;
        phone_number: string;
        profile_picture: string;
        staff_type: 'T' | 'M';
    }[]>([]);

    useEffect(() => {
        AxiosInstance.get('/api/staff/')
            .then((response) => {
                console.log(response.data);
                setApiData(response.data);
            })
            .catch((error) => {
                console.error(error);
                toast.error("Failed to fetch staffs");
            });

    }, [])

    return (
        <div className={'p-4 flex flex-col gap-4'}>
            <div>
                <PageHeader
                    title="Staffs"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Staff", href: "/staff/list/" },
                    ]}
                    onRefresh={() => console.log("Refreshing...")}
                    onPrint={() => console.log("Printing...")}
                    onExport={() => console.log("Exporting...")}
                    primaryAction={{
                        label: "Add Staff",
                        onClick: () => navigate('/staff/add/'),
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

                {
                    apiData?.map((each, index) => (
                        <StaffCard
                            key={index}
                            id={each.id}
                            name={each.first_name + " " + each.last_name}
                            email={each.email}
                            phone={each.phone_number}
                            positionDetail={each.position_detail}
                            status={each.account_status}
                            avatarUrl={each.profile_picture}
                            staffType={each.staff_type}
                        />
                    ))
                }

            </div>
        </div>
    );
}