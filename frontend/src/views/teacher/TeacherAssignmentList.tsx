"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { PlusCircle, Filter, Search, BookOpen, Users, Clock, X, Upload, Calendar } from "lucide-react"
import { isPast, format } from "date-fns"

import { PageHeader } from "@/components/ListPage/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherAssignmentCard } from "./TeacherAssignmentCard"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

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
    // Existing assignments...

    {
        id: "8",
        title: "Coloring Fun: Fruits and Vegetables",
        description:
            "Color the pictures of fruits and vegetables in your activity book (Pages 5-8). Use bright colors and stay within the lines!",
        subject: {
            id: "art-201",
            name: "Art",
        },
        class: {
            id: "class-1",
            name: "Class 1",
        },
        section: {
            id: "section-a",
            name: "Section A",
        },
        dueDate: "2025-05-07T23:59:59Z",
        status: "active",
        submissionCount: 10,
        totalStudents: 20,
        createdAt: "2025-05-01T08:00:00Z",
        attachments: [
            {
                id: "att-11",
                name: "fruit_veggie_coloring_pages.pdf",
                type: "application/pdf",
                url: "#",
            },
        ],
    },
    {
        id: "9",
        title: "Counting Practice: Numbers 1 to 50",
        description:
            "Write numbers from 1 to 50 in your math notebook. Draw 5 things you can count in your home and write how many there are.",
        subject: {
            id: "math-202",
            name: "Mathematics",
        },
        class: {
            id: "class-2",
            name: "Class 2",
        },
        section: {
            id: "section-a",
            name: "Section A",
        },
        dueDate: "2025-05-08T23:59:59Z",
        status: "active",
        submissionCount: 12,
        totalStudents: 22,
        createdAt: "2025-05-01T09:00:00Z",
        attachments: [
            {
                id: "att-12",
                name: "counting_practice_sheet.pdf",
                type: "application/pdf",
                url: "#",
            },
        ],
    },
];

// Dummy data for subjects, classes, and sections
const allSubjects = [
    { id: "math-101", name: "Mathematics" },
    { id: "sci-102", name: "Science" },
    { id: "eng-103", name: "English" },
    { id: "hist-104", name: "History" },
    { id: "cs-105", name: "Computer Science" },
    { id: "geo-106", name: "Geography" },
    { id: "phys-107", name: "Physics" },
]

const allClasses = [
    { id: "class-9b", name: "Class 1" },
    { id: "class-10a", name: "Class 10" },
    { id: "class-10b", name: "Class 10" },
    { id: "class-11a", name: "Class 11" },
    { id: "class-11c", name: "Class 11" },
    { id: "class-12a", name: "Class 12" },
    { id: "class-12b", name: "Class 12" },
]

const allSections = [
    { id: "section-a", name: "Section A" },
    { id: "section-b", name: "Section B" },
    { id: "section-c", name: "Section C" },
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

    // Add Assignment Dialog State
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        subjectId: "",
        classId: "",
        sectionId: "",
        dueDate: new Date(),
        status: "draft" as "active" | "inactive" | "draft",
    })
    const [attachments, setAttachments] = useState<File[]>([])

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

    // Handle input changes for new assignment
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewAssignment((prev) => ({ ...prev, [name]: value }))
    }

    // Handle file uploads
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files)
            setAttachments((prev) => [...prev, ...fileList])
        }
    }

    // Remove an attachment
    const handleRemoveAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index))
    }

    // Handle date selection
    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setNewAssignment((prev) => ({ ...prev, dueDate: date }))
        }
    }

    // Handle form submission
    const handleSubmitAssignment = async () => {
        try {
            // Validate form
            if (!newAssignment.title || !newAssignment.description || !newAssignment.subjectId || !newAssignment.classId) {
                toast.error("Please fill in all required fields")
                return
            }

            // Create assignment object
            const subject = allSubjects.find((s) => s.id === newAssignment.subjectId)
            const classObj = allClasses.find((c) => c.id === newAssignment.classId)
            const section = allSections.find((s) => s.id === newAssignment.sectionId)

            if (!subject || !classObj) {
                toast.error("Invalid subject or class selected")
                return
            }

            const createdAssignment: Assignment = {
                id: `new-${Date.now()}`,
                title: newAssignment.title,
                description: newAssignment.description,
                subject: subject,
                class: classObj,
                section: section,
                dueDate: newAssignment.dueDate.toISOString(),
                status: newAssignment.status,
                submissionCount: 0,
                totalStudents: 0,
                createdAt: new Date().toISOString(),
                attachments: attachments.map((file, index) => ({
                    id: `new-att-${index}`,
                    name: file.name,
                    type: file.type,
                    url: "#", // In a real app, this would be the uploaded file URL
                })),
            }

            // In a real application, you would upload files and create the assignment via API
            // const formData = new FormData()
            // formData.append('title', newAssignment.title)
            // ...other fields
            // attachments.forEach(file => formData.append('attachments', file))
            // const response = await AxiosInstance.post('/api/academic/assignments/', formData)
            // const createdAssignment = response.data

            // Update local state
            setAssignments([createdAssignment, ...assignments])

            // Reset form and close dialog
            setNewAssignment({
                title: "",
                description: "",
                subjectId: "",
                classId: "",
                sectionId: "",
                dueDate: new Date(),
                status: "draft",
            })
            setAttachments([])
            setIsAddDialogOpen(false)

            toast.success("Assignment created successfully")
        } catch (error) {
            console.error("Error creating assignment:", error)
            toast.error("Failed to create assignment")
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
                    onClick: () => setIsAddDialogOpen(true),
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

            {/* Add Assignment Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Assignment</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new assignment. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Title */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={newAssignment.title}
                                onChange={handleInputChange}
                                placeholder="Enter assignment title"
                                className="col-span-3"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={newAssignment.description}
                                onChange={handleInputChange}
                                placeholder="Enter assignment description"
                                className="col-span-3"
                                required
                            />
                        </div>

                        {/* Subject */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject" className="text-right">
                                Subject <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={newAssignment.subjectId}
                                onValueChange={(value) => setNewAssignment((prev) => ({ ...prev, subjectId: value }))}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allSubjects.map((subject) => (
                                        <SelectItem key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Class */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="class" className="text-right">
                                Class <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={newAssignment.classId}
                                onValueChange={(value) => setNewAssignment((prev) => ({ ...prev, classId: value }))}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allClasses.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Section */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="section" className="text-right">
                                Section
                            </Label>
                            <Select
                                value={newAssignment.sectionId}
                                onValueChange={(value) => setNewAssignment((prev) => ({ ...prev, sectionId: value }))}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a section (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allSections.map((section) => (
                                        <SelectItem key={section.id} value={section.id}>
                                            {section.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Due Date */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dueDate" className="text-right">
                                Due Date <span className="text-red-500">*</span>
                            </Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {newAssignment.dueDate ? format(newAssignment.dueDate, "PPP") : "Select a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            mode="single"
                                            selected={newAssignment.dueDate}
                                            onSelect={handleDateChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select
                                value={newAssignment.status}
                                onValueChange={(value: "active" | "inactive" | "draft") =>
                                    setNewAssignment((prev) => ({ ...prev, status: value }))
                                }
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Attachments */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="attachments" className="text-right pt-2">
                                Attachments
                            </Label>
                            <div className="col-span-3 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Input id="attachments" type="file" onChange={handleFileChange} className="flex-1" multiple />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => document.getElementById("attachments")?.click()}
                                    >
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Attachment List */}
                                {attachments.length > 0 && (
                                    <div className="border rounded-md p-2 space-y-2">
                                        <p className="text-sm font-medium">Attached Files:</p>
                                        <ul className="space-y-1">
                                            {attachments.map((file, index) => (
                                                <li key={index} className="flex items-center justify-between text-sm p-1 bg-gray-50 rounded">
                                                    <span className="truncate max-w-[200px]">{file.name}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => handleRemoveAttachment(index)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitAssignment}>Create Assignment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
