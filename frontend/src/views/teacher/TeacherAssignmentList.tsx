"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { PlusCircle, Filter, Search, BookOpen, Users, Clock } from "lucide-react"
import { isPast } from "date-fns"

import { PageHeader } from "@/components/ListPage/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherAssignmentCard } from "./TeacherAssignmentCard"

// Assignment interface
export interface Assignment {
    id: string
    title: string
    description: string
    subject: {
        id: string
        name: string
    }
    class: {
        id: string
        name: string
    }
    section?: {
        id: string
        name: string
    }
    dueDate: string
    status: "active" | "inactive" | "draft"
    submissionCount: number
    totalStudents: number
    createdAt: string
    attachments: {
        id: string
        name: string
        type: string
        url: string
    }[]
}

// Dummy data for assignments
const dummyAssignments: Assignment[] = [
    {
        id: "1",
        title: "Mathematics Problem Set: Algebra Fundamentals",
        description: "Complete problems 1-20 in Chapter 3. Show all work and explain your reasoning for each step.",
        subject: {
            id: "math-101",
            name: "Mathematics",
        },
        class: {
            id: "class-10a",
            name: "Class 10",
        },
        section: {
            id: "section-a",
            name: "Section A",
        },
        dueDate: "2025-05-10T23:59:59Z",
        status: "active",
        submissionCount: 18,
        totalStudents: 25,
        createdAt: "2025-05-01T10:30:00Z",
        attachments: [
            {
                id: "att-1",
                name: "algebra_worksheet.pdf",
                type: "application/pdf",
                url: "#",
            },
            {
                id: "att-2",
                name: "formula_sheet.docx",
                type: "application/msword",
                url: "#",
            },
        ],
    },
    {
        id: "2",
        title: "Science Lab Report: Photosynthesis Experiment",
        description:
            "Write a detailed lab report on the photosynthesis experiment conducted in class. Include hypothesis, methodology, results, and conclusion.",
        subject: {
            id: "sci-102",
            name: "Science",
        },
        class: {
            id: "class-9b",
            name: "Class 9",
        },
        section: {
            id: "section-b",
            name: "Section B",
        },
        dueDate: "2025-05-15T23:59:59Z",
        status: "active",
        submissionCount: 5,
        totalStudents: 30,
        createdAt: "2025-05-03T14:15:00Z",
        attachments: [
            {
                id: "att-3",
                name: "lab_instructions.pdf",
                type: "application/pdf",
                url: "#",
            },
        ],
    },
    {
        id: "3",
        title: "English Literature Essay: Shakespeare's Macbeth",
        description:
            "Write a 1000-word analytical essay on the theme of ambition in Shakespeare's Macbeth. Use textual evidence to support your arguments.",
        subject: {
            id: "eng-103",
            name: "English",
        },
        class: {
            id: "class-11c",
            name: "Class 11",
        },
        section: {
            id: "section-c",
            name: "Section C",
        },
        dueDate: "2025-05-20T23:59:59Z",
        status: "active",
        submissionCount: 22,
        totalStudents: 22,
        createdAt: "2025-04-28T09:45:00Z",
        attachments: [],
    },
    {
        id: "4",
        title: "History Research Project: Ancient Civilizations",
        description:
            "Research and create a presentation on one ancient civilization of your choice. Cover aspects such as governance, culture, achievements, and legacy.",
        subject: {
            id: "hist-104",
            name: "History",
        },
        class: {
            id: "class-10b",
            name: "Class 10",
        },
        section: {
            id: "section-b",
            name: "Section B",
        },
        dueDate: "2025-05-25T23:59:59Z",
        status: "active",
        submissionCount: 0,
        totalStudents: 28,
        createdAt: "2025-05-04T11:20:00Z",
        attachments: [
            {
                id: "att-4",
                name: "research_guidelines.pdf",
                type: "application/pdf",
                url: "#",
            },
            {
                id: "att-5",
                name: "presentation_template.pptx",
                type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                url: "#",
            },
            {
                id: "att-6",
                name: "sample_project.pdf",
                type: "application/pdf",
                url: "#",
            },
        ],
    },
    {
        id: "5",
        title: "Computer Science Programming Assignment: Algorithms",
        description:
            "Implement the sorting algorithms discussed in class (bubble sort, insertion sort, and selection sort) and compare their performance with different input sizes.",
        subject: {
            id: "cs-105",
            name: "Computer Science",
        },
        class: {
            id: "class-12a",
            name: "Class 12",
        },
        section: {
            id: "section-a",
            name: "Section A",
        },
        dueDate: "2025-05-12T23:59:59Z",
        status: "active",
        submissionCount: 15,
        totalStudents: 20,
        createdAt: "2025-05-02T13:10:00Z",
        attachments: [
            {
                id: "att-7",
                name: "algorithm_specs.pdf",
                type: "application/pdf",
                url: "#",
            },
        ],
    },
    {
        id: "6",
        title: "Geography Project: Climate Change Impact",
        description:
            "Create a detailed report on the impact of climate change on a specific region of your choice. Include data, charts, and proposed solutions.",
        subject: {
            id: "geo-106",
            name: "Geography",
        },
        class: {
            id: "class-11a",
            name: "Class 11",
        },
        section: {
            id: "section-a",
            name: "Section A",
        },
        dueDate: "2025-05-30T23:59:59Z",
        status: "inactive",
        submissionCount: 8,
        totalStudents: 26,
        createdAt: "2025-04-30T15:45:00Z",
        attachments: [
            {
                id: "att-8",
                name: "climate_data.xlsx",
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                url: "#",
            },
            {
                id: "att-9",
                name: "report_template.docx",
                type: "application/msword",
                url: "#",
            },
        ],
    },
    {
        id: "7",
        title: "Physics Problem Set: Mechanics and Motion",
        description:
            "Solve the problems related to Newton's laws of motion, projectile motion, and conservation of energy from Chapter 4.",
        subject: {
            id: "phys-107",
            name: "Physics",
        },
        class: {
            id: "class-12b",
            name: "Class 12",
        },
        section: {
            id: "section-b",
            name: "Section B",
        },
        dueDate: "2025-05-18T23:59:59Z",
        status: "draft",
        submissionCount: 0,
        totalStudents: 24,
        createdAt: "2025-05-05T09:30:00Z",
        attachments: [
            {
                id: "att-10",
                name: "physics_problems.pdf",
                type: "application/pdf",
                url: "#",
            },
        ],
    },
]

export default function TeacherAssignmentPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [subjectFilter, setSubjectFilter] = useState<string>("all")
    const [classFilter, setClassFilter] = useState<string>("all")
    const [sectionFilter, setSectionFilter] = useState<string>("all")
    const [activeTab, setActiveTab] = useState("all")
    const navigate = useNavigate()

    useEffect(() => {
        fetchAssignments()
    }, [])

    const fetchAssignments = async () => {
        setLoading(true)
        try {
            // In a real application, you would fetch from your API
            // const response = await AxiosInstance.get('/api/academic/assignments/')
            // setAssignments(response.data)

            // Using dummy data for now
            setTimeout(() => {
                setAssignments(dummyAssignments)
                setLoading(false)
            }, 800)
        } catch (error) {
            console.error("Error fetching assignments:", error)
            toast.error("Failed to load assignments. Please try again.")
            setLoading(false)
        }
    }

    // Filter assignments based on search query and filters
    const filteredAssignments = assignments.filter((assignment) => {
        const matchesSearch =
            assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "expired" && isPast(new Date(assignment.dueDate)) && assignment.status === "active") ||
            (statusFilter !== "expired" && assignment.status === statusFilter)

        const matchesSubject = subjectFilter === "all" || assignment.subject.id === subjectFilter

        const matchesClass = classFilter === "all" || assignment.class.id === classFilter

        const matchesSection = sectionFilter === "all" || assignment.section?.id === sectionFilter

        const matchesTab =
            activeTab === "all" ||
            (activeTab === "active" && assignment.status === "active") ||
            (activeTab === "inactive" && assignment.status === "inactive") ||
            (activeTab === "draft" && assignment.status === "draft")

        return matchesSearch && matchesStatus && matchesSubject && matchesClass && matchesSection && matchesTab
    })

    // Get unique subjects, classes, and sections for filters
    const subjects = [...new Map(assignments.map((item) => [item.subject.id, item.subject])).values()]
    const classes = [...new Map(assignments.map((item) => [item.class.id, item.class])).values()]
    const sections = [
        ...new Map(assignments.filter((item) => item.section).map((item) => [item.section?.id, item.section])).values(),
    ]

    // Stats for dashboard cards
    const activeAssignments = assignments.filter((a) => a.status === "active").length
    const inactiveAssignments = assignments.filter((a) => a.status === "inactive").length
    const draftAssignments = assignments.filter((a) => a.status === "draft").length
    const totalAssignments = assignments.length

    const handleDeleteAssignment = async (id: string) => {
        try {
            // In a real application, you would call your API
            // await AxiosInstance.delete(`/api/academic/assignments/${id}/`)

            // Update local state
            setAssignments(assignments.filter((assignment) => assignment.id !== id))
            toast.success("Assignment deleted successfully")
        } catch (error) {
            console.error("Error deleting assignment:", error)
            toast.error("Failed to delete assignment")
        }
    }

    const handleDuplicateAssignment = async (id: string) => {
        try {
            const assignmentToDuplicate = assignments.find((assignment) => assignment.id === id)
            if (assignmentToDuplicate) {
                const newAssignment = {
                    ...assignmentToDuplicate,
                    id: `${Date.now()}`,
                    title: `Copy of ${assignmentToDuplicate.title}`,
                    createdAt: new Date().toISOString(),
                    status: "draft" as const,
                    submissionCount: 0,
                }

                // In a real application, you would call your API
                // const response = await AxiosInstance.post('/api/academic/assignments/', newAssignment)
                // const createdAssignment = response.data

                // Update local state
                setAssignments([newAssignment, ...assignments])
                toast.success("Assignment duplicated successfully")
            }
        } catch (error) {
            console.error("Error duplicating assignment:", error)
            toast.error("Failed to duplicate assignment")
        }
    }

    const handleToggleStatus = async (id: string) => {
        try {
            const assignmentToUpdate = assignments.find((assignment) => assignment.id === id)
            if (assignmentToUpdate) {
                const newStatus = assignmentToUpdate.status === "active" ? "inactive" : "active"

                // In a real application, you would call your API
                // await AxiosInstance.patch(`/api/academic/assignments/${id}/`, { status: newStatus })

                // Update local state
                setAssignments(
                    assignments.map((assignment) =>
                        assignment.id === id ? { ...assignment, status: newStatus as "active" | "inactive" | "draft" } : assignment,
                    ),
                )

                toast.success(`Assignment ${newStatus === "active" ? "activated" : "deactivated"} successfully`)
            }
        } catch (error) {
            console.error("Error updating assignment status:", error)
            toast.error("Failed to update assignment status")
        }
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <PageHeader
                title="Assignments"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Assignments", href: "/assignment/list" },
                ]}
                onRefresh={fetchAssignments}
                onPrint={() => console.log("Printing...")}
                onExport={() => console.log("Exporting...")}
                primaryAction={{
                    label: "Create Assignment",
                    onClick: () => navigate("/teacher/assignments/create"),
                    icon: <PlusCircle className="h-4 w-4" />,
                }}
            />

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAssignments}</div>
                        <p className="text-xs text-muted-foreground">All created assignments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeAssignments}</div>
                        <p className="text-xs text-muted-foreground">Visible to students</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Assignments</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inactiveAssignments}</div>
                        <p className="text-xs text-muted-foreground">Hidden from students</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Draft Assignments</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{draftAssignments}</div>
                        <p className="text-xs text-muted-foreground">Work in progress</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
                        <TabsTrigger value="draft">Drafts</TabsTrigger>
                    </TabsList>

                    {/* Search on the right */}
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search assignments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8"
                        />
                    </div>
                </div>

                {/* Right side filters: Status, Class, Section, Subject */}
                <div className="flex flex-wrap items-center gap-2 mb-4 justify-end">
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Class Filter */}
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Section Filter */}
                    <Select value={sectionFilter} onValueChange={setSectionFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Section" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sections</SelectItem>
                            {sections.map((section) => (
                                // @ts-expect-error: dsfaf
                                <SelectItem key={section?.id} value={section?.id}>
                                    {section?.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Subject Filter */}
                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" className="h-10 w-10">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                <TabsContent value="all" className="mt-0">
                    <TeacherAssignmentCard
                        assignments={filteredAssignments}
                        loading={loading}
                        onDelete={handleDeleteAssignment}
                        onDuplicate={handleDuplicateAssignment}
                        onView={(id) => navigate(`/assignment/detail/${id}`)}
                        onEdit={(id) => navigate(`/assignment/edit/${id}`)}
                        onToggleStatus={handleToggleStatus}
                    />
                </TabsContent>
                <TabsContent value="active" className="mt-0">
                    <TeacherAssignmentCard
                        assignments={filteredAssignments}
                        loading={loading}
                        onDelete={handleDeleteAssignment}
                        onDuplicate={handleDuplicateAssignment}
                        onView={(id) => navigate(`/assignment/detail/${id}`)}
                        onEdit={(id) => navigate(`/assignments/${id}/edit`)}
                        onToggleStatus={handleToggleStatus}
                    />
                </TabsContent>
                <TabsContent value="inactive" className="mt-0">
                    <TeacherAssignmentCard
                        assignments={filteredAssignments}
                        loading={loading}
                        onDelete={handleDeleteAssignment}
                        onDuplicate={handleDuplicateAssignment}
                        onView={(id) => navigate(`/assignment/detail/${id}`)}
                        onEdit={(id) => navigate(`/assignments/${id}/edit`)}
                        onToggleStatus={handleToggleStatus}
                    />
                </TabsContent>
                <TabsContent value="draft" className="mt-0">
                    <TeacherAssignmentCard
                        assignments={filteredAssignments}
                        loading={loading}
                        onDelete={handleDeleteAssignment}
                        onDuplicate={handleDuplicateAssignment}
                        onView={(id) => navigate(`/assignment/detail/${id}`)}
                        onEdit={(id) => navigate(`/assignments/${id}/edit`)}
                        onToggleStatus={handleToggleStatus}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
