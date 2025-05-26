import { useEffect, useState, type ReactNode } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import { User } from "lucide-react"
import { CustomStatusBadge } from "@/components/ListPage/CustomStatusBadge.tsx"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const TagCard = ({ value }: { value: string }) => {
    return (
        <div className="bg-purple-100 text-purple-500 px-2 py-0.5 border border-purple-500 rounded-full">
            <p className="text-gray-600 text-xs">{value}</p>
        </div>
    )
}

const Container = ({ children }: { children: ReactNode }) => {
    return <div className="p-4 shadow rounded-md space-y-4 bg-white">{children}</div>
}

const Heading = ({ children }: { children: ReactNode }) => {
    return <h3 className="text-lg font-medium mb-3">{children}</h3>
}


interface Child {
    id: string
    profile_picture: string | null
    first_name: string
    last_name: string
    date_of_birth: string
    gender: string
    account_status: "A" | "I" | "D"
    blood_group: string
    personal_email: string
    phone_number: string
    email: string
    current_address: string
    permanent_address: string
    transportation: string
    pickup_address: string
    previous_school: string
    previous_school_address: string
    created_at: string
    updated_at: string
    father: string
    mother: string
    guardian: string
}

interface Parent {
    id: string
    profile_picture: string | null
    full_name: string
    email: string
    phone_number: string
    occupation: string
    relationship: string
    guardian_relation: string | null
    address: string | null
    created_at: string
    updated_at: string
    children: Child[]
}

export function ParentDetailPage() {
    const navigate = useNavigate()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [parent, setParent] = useState<Parent | null>(null)

    useEffect(() => {
        setLoading(true)
        fetchParentDetail()
    }, [params.id])

    const fetchParentDetail = () => {
        AxiosInstance.get(`/api/academic/parent-detial/${params.id}/`)
            .then((response) => {
                console.log(response.data)
                setParent(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const getGender = (code: string) => {
        switch (code) {
            case "M":
                return "Male"
            case "F":
                return "Female"
            case "O":
                return "Other"
            default:
                return code
        }
    }

    const getTransportation = (code: string) => {
        switch (code) {
            case "SB":
                return "School Bus"
            case "PV":
                return "Private Vehicle"
            case "OF":
                return "On Foot"
            case "PB":
                return "Public Bus"
            default:
                return code
        }
    }

    const getRelationship = (code: string) => {
        switch (code) {
            case "F":
                return "Father"
            case "M":
                return "Mother"
            case "G":
                return "Guardian"
            default:
                return code
        }
    }

    const getAccountStatus = (code: string) => {
        switch (code) {
            case "A":
                return "Active"
            case "I":
                return "Inactive"
            case "D":
                return "Disabled"
            default:
                return "Unknown"
        }
    }

    const ProfileCard = () => {
        if (!parent) return null

        return (
            <div className="col-span-full">
                <div className="bg-white rounded-md shadow">
                    <div className="p-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={parent.profile_picture || "/placeholder.svg"}
                                alt="Profile picture"
                                className="w-20 h-20 rounded-md object-cover"
                            />
                            <div className="space-y-2">
                                <h2 className="text-xl font-medium">{parent.full_name}</h2>
                                <TagCard value={getRelationship(parent.relationship)} />
                                <p className="text-gray-600 text-sm">Occupation: {parent.occupation}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Email</span>
                                <span className="text-gray-600 text-sm">{parent.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Phone</span>
                                <span className="text-gray-600 text-sm">{parent.phone_number}</span>
                            </div>
                            {parent.address && (
                                <div className="flex justify-between">
                                    <span className="text-gray-700 text-sm font-medium">Address</span>
                                    <span className="text-gray-600 text-sm">{parent.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const BasicInfo = () => {
        if (!parent) return null

        const basicInfoData = [
            {
                label: "Full name",
                value: parent.full_name,
            },
            {
                label: "Relationship",
                value: getRelationship(parent.relationship),
            },
            {
                label: "Occupation",
                value: parent.occupation,
            },
            {
                label: "Email",
                value: parent.email,
            },
            {
                label: "Phone Number",
                value: parent.phone_number,
            },
        ]

        if (parent.relationship === "G" && parent.guardian_relation) {
            basicInfoData.push({
                label: "Guardian Relation",
                value: parent.guardian_relation,
            })
        }

        if (parent.address) {
            basicInfoData.push({
                label: "Address",
                value: parent.address,
            })
        }

        return (
            <div className="p-4 bg-white rounded-md shadow">
                <h3 className="text-lg font-medium mb-3">Basic Information</h3>

                <div className="space-y-4">
                    {basicInfoData.map((item, index) => {
                        return (
                            <div key={index} className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">{item.label}</span>
                                <span className="text-gray-600 text-sm">{item.value}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    const ChildCard = ({ child }: { child: Child }) => {
        if (!child) return null

        return (
            <Dialog>
                <DialogTrigger className="bg-white shadow hover:shadow-md transition-shadow rounded-md p-4 space-y-2 cursor-pointer border border-gray-100 w-full">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={child.profile_picture || "/placeholder.svg"}
                                alt={`${child.first_name} ${child.last_name}`}
                            />
                            <AvatarFallback>
                                <User className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <h3 className="text-lg font-medium">
                                {child.first_name} {child.last_name}
                            </h3>
                            <p className="text-gray-600 text-sm">{child.email}</p>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Child Information</DialogTitle>
                        <DialogDescription className="pt-2 text-sm text-gray-500">Academic and personal details</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={child.profile_picture || "/placeholder.svg"}
                                    alt={`${child.first_name} ${child.last_name}`}
                                />
                                <AvatarFallback>
                                    <User className="h-8 w-8" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {child.first_name} {child.last_name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <CustomStatusBadge variant={child.account_status}>
                                        {getAccountStatus(child.account_status)}
                                    </CustomStatusBadge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-md border border-gray-100">
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Email</span>
                                <span className="text-gray-600 text-sm">{child.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Date of Birth</span>
                                <span className="text-gray-600 text-sm">{formatDate(child.date_of_birth)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Gender</span>
                                <span className="text-gray-600 text-sm">{getGender(child.gender)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Blood Group</span>
                                <span className="text-gray-600 text-sm">{child.blood_group}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Phone</span>
                                <span className="text-gray-600 text-sm">{child.phone_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Transportation</span>
                                <span className="text-gray-600 text-sm">{getTransportation(child.transportation)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <Button variant="outline" onClick={() => navigate(`/students/detail/${child.id}`)}>
                            View Full Profile
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                document.querySelector('[data-state="open"]')?.dispatchEvent(new Event("close", { bubbles: true }))
                            }
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    const ChildrenSection = () => {
        if (!parent || !parent.children || parent.children.length === 0) {
            return (
                <Container>
                    <Heading>Children</Heading>
                    <div className="p-4 text-center bg-gray-50 rounded-md">
                        <p className="text-gray-500">No children associated with this parent.</p>
                    </div>
                </Container>
            )
        }

        return (
            <Container>
                <Heading>Children ({parent.children.length})</Heading>
                <div className="space-y-4">
                    {parent.children.map((child) => (
                        <ChildCard key={child.id} child={child} />
                    ))}
                </div>
            </Container>
        )
    }

    if (loading) {
        return (
            <div className="p-4 flex flex-col gap-2 bg-slate-100 min-h-screen">
                <div className="animate-pulse">
                    <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>

                <div className="grid grid-cols-10 gap-4 mt-4">
                    <div className="col-span-10 lg:col-span-3 space-y-4">
                        <div className="bg-white rounded-md shadow p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                                <div className="space-y-2">
                                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="h-6 w-40 bg-gray-200 rounded mb-3"></div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-md shadow p-4">
                            <div className="h-6 w-40 bg-gray-200 rounded mb-3"></div>
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="flex justify-between">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-10 lg:col-span-7">
                        <div className="bg-white rounded-md shadow p-4">
                            <div className="h-6 w-40 bg-gray-200 rounded mb-3"></div>
                            <div className="space-y-4">
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                        <div>
                                            <div className="h-5 w-24 bg-gray-200 rounded mb-1"></div>
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!parent) {
        return (
            <div className="p-4 flex flex-col gap-4 bg-slate-100 min-h-screen">
                <PageHeader
                    title="Parent Details"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Parents", href: "/parent/list/" },
                        { label: "Parent Detail", href: "#" },
                    ]}

                />
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
                    <div className="text-red-500 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Parent Not Found</h2>
                    <p className="text-gray-500 mb-4">
                        The parent you're looking for doesn't exist or you don't have permission to view it.
                    </p>
                    <Button onClick={() => fetchParentDetail()}>Refresh</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 flex flex-col gap-2 bg-slate-100">
            <div>
                <PageHeader
                    title="Parent Details"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Parents", href: "/parent/list/" },
                        { label: "Parent Detail", href: `/parents/detail/${params.id}` },
                    ]}

                />
            </div>

            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-10 lg:col-span-3 space-y-4 flex flex-col">
                    <ProfileCard />
                    <BasicInfo />
                </div>

                <div className="col-span-10 lg:col-span-7">
                    <ChildrenSection />
                </div>
            </div>
        </div>
    )
}
