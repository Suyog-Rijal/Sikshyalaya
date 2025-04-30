"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import { Pencil, User } from "lucide-react"
import { CustomStatusBadge } from "@/components/ListPage/CustomStatusBadge.tsx"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import { toast } from "sonner"
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

const Content = ({ children, className }: { children: ReactNode; className?: string }) => {
    return (
        <div className={`grid gap-6 ${className ? className : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
            {children}
        </div>
    )
}

const ContentItems = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="flex flex-col">
            <span className="text-gray-700 text-sm font-medium">{label}</span>
            <span className="text-gray-600 text-sm">{value}</span>
        </div>
    )
}

interface Parent {
    id: string
    profile_picture: string | null
    full_name: string
    email: string
    password: string
    phone_number: string
    occupation: string
    relationship: string
    guardian_relation: string | null
    address: string | null
    created_at: string
    updated_at: string
}

interface Student {
    id: string
    father: Parent
    mother: Parent
    guardian: Parent
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
}

export function StudentDetailPage() {
    const navigate = useNavigate()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [student, setStudent] = useState<Student | null>(null)

    useEffect(() => {
        setLoading(true)
        AxiosInstance.get(`/api/student/student-detail/${params.id}/`)
            .then((response) => {
                setStudent(response.data)
            })
            .catch((error) => {
                console.error(error)
                toast.error("Failed to fetch student details")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [params.id])

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

    const ProfileCard = () => {
        if (!student) return null

        return (
            <div className="col-span-full">
                <div className="bg-white rounded-md shadow">
                    <div className="p-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={student.profile_picture || "/placeholder.svg"}
                                alt="Profile picture"
                                className="w-20 h-20 rounded-md object-cover"
                            />
                            <div className="space-y-2">
                                <h2 className="text-xl font-medium">
                                    {student.first_name} {student.last_name}
                                </h2>
                                <CustomStatusBadge variant={student.account_status}>
                                    {student.account_status === "A"
                                        ? "Active"
                                        : student.account_status === "I"
                                            ? "Inactive"
                                            : student.account_status === "D"
                                                ? "Disabled"
                                                : "Unknown"}
                                </CustomStatusBadge>
                                <p className="text-gray-600 text-sm">Date of Birth: {formatDate(student.date_of_birth)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <h3 className="text-lg font-medium mb-3">Academic Information</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Email</span>
                                <span className="text-gray-600 text-sm">{student.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Transportation</span>
                                <span className="text-gray-600 text-sm flex gap-2 flex-wrap justify-end">
                  <TagCard value={getTransportation(student.transportation)}></TagCard>
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const BasicInfo = () => {
        if (!student) return null

        const basicInfoData = [
            {
                label: "Full name",
                value: student.first_name + " " + student.last_name,
            },
            {
                label: "Gender",
                value: getGender(student.gender),
            },
            {
                label: "Date of Birth",
                value: formatDate(student.date_of_birth),
            },
            {
                label: "Blood Group",
                value: student.blood_group,
            },
            {
                label: "Personal Email",
                value: student.personal_email,
            },
            {
                label: "Phone Number",
                value: student.phone_number,
            },
            {
                label: "Current Address",
                value: student.current_address,
            },
            {
                label: "Permanent Address",
                value: student.permanent_address,
            },
        ]
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

    const ParentCard = ({ parent, title }: { parent: Parent; title: string }) => {
        if (!parent) return null

        return (
            <Dialog>
                <DialogTrigger className="bg-white shadow hover:shadow-md transition-shadow rounded-md p-4 space-y-2 cursor-pointer border border-gray-100 w-full">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={parent.profile_picture || "/placeholder.svg"} alt={parent.full_name} />
                            <AvatarFallback>
                                <User className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <h3 className="text-lg font-medium">{title}</h3>
                            <p className="text-gray-600 text-sm">{parent.full_name}</p>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{title} Information</DialogTitle>
                        <DialogDescription className="pt-2 text-sm text-gray-500">Contact and personal details</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={parent.profile_picture || "/placeholder.svg"} alt={parent.full_name} />
                                <AvatarFallback>
                                    <User className="h-8 w-8" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-semibold">{parent.full_name}</h3>
                                <p className="text-sm text-muted-foreground">{getRelationship(parent.relationship)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-md border border-gray-100">
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Email</span>
                                <span className="text-gray-600 text-sm">{parent.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Phone</span>
                                <span className="text-gray-600 text-sm">{parent.phone_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700 text-sm font-medium">Occupation</span>
                                <span className="text-gray-600 text-sm">{parent.occupation}</span>
                            </div>
                            {parent.relationship === "G" && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700 text-sm font-medium">Relation</span>
                                        <span className="text-gray-600 text-sm">{parent.guardian_relation}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700 text-sm font-medium">Address</span>
                                        <span className="text-gray-600 text-sm">{parent.address || "N/A"}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
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

    const AcademicDetail = () => {
        if (!student) return null

        return (
            <div className="space-y-4">
                <Container>
                    <Heading>School Information</Heading>
                    <Content>
                        <ContentItems label="Email" value={student.email} />
                        <ContentItems label="Transportation" value={getTransportation(student.transportation)} />
                        <ContentItems label="Pickup Address" value={student.pickup_address} />
                    </Content>
                </Container>

                <Container>
                    <Heading>Previous School Information</Heading>
                    <Content>
                        <ContentItems label="Previous School" value={student.previous_school} />
                        <ContentItems label="Previous School Address" value={student.previous_school_address} />
                    </Content>
                </Container>
            </div>
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
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className="flex justify-between">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-10 lg:col-span-7">
                        <div className="space-y-4">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-md shadow p-4">
                                    <div className="h-6 w-40 bg-gray-200 rounded mb-3"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {Array.from({ length: 3 }).map((_, idx) => (
                                            <div key={idx} className="flex flex-col">
                                                <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="bg-white rounded-md shadow p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                            <div>
                                                <div className="h-5 w-24 bg-gray-200 rounded mb-1"></div>
                                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                            </div>
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

    if (!student) {
        return (
            <div className="p-4 flex flex-col gap-4 bg-slate-100 min-h-screen">
                <PageHeader
                    title="Student Details"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Students", href: "/students/list/" },
                        { label: "Student Detail", href: "#" },
                    ]}
                    primaryAction={{
                        label: "Back to List",
                        onClick: () => navigate("/students/list/"),
                        icon: <User className="h-4 w-4" />,
                    }}
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
                    <h2 className="text-xl font-semibold mb-2">Student Not Found</h2>
                    <p className="text-gray-500 mb-4">
                        The student you're looking for doesn't exist or you don't have permission to view it.
                    </p>
                    <Button onClick={() => navigate("/students/list/")}>Back to Students List</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 flex flex-col gap-2 bg-slate-100">
            <div>
                <PageHeader
                    title="Student Details"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Students", href: "/students/list/" },
                        { label: "Student Detail", href: `/students/detail/${params.id}` },
                    ]}
                    primaryAction={{
                        label: "Edit Detail",
                        onClick: () => navigate(`/students/edit/${student.id}`),
                        icon: <Pencil className="h-4 w-4" />,
                    }}
                />
            </div>

            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-10 lg:col-span-3 space-y-4 flex flex-col">
                    <ProfileCard />
                    <BasicInfo />
                </div>

                <div className="col-span-10 lg:col-span-7">
                    <div className="space-y-4">
                        <AcademicDetail />

                        <div className="space-y-4">
                            <ParentCard parent={student.father} title="Father" />
                            <ParentCard parent={student.mother} title="Mother" />
                            <ParentCard parent={student.guardian} title="Guardian" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
