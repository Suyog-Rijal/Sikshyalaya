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
import { Skeleton } from "@/components/ui/skeleton"
import axiosInstance from "@/auth/AxiosInstance.ts"
import {useAuthStore} from "@/store/AuthStore.ts";

interface Assignment {
    id: string
    title: string
    description: string
    due_date: string // ISO 8601 date format
    subject: {
        id: string
        name: string
    }
    school_class: {
        id: string
        name: string
    }
    section: {
        name: string | null
    }
    is_active: boolean
    total_students: number
    total_submissions: number
}

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
    const {role} = useAuthStore()

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

    const [formData, setFormData] = useState<{
        classes: Array<{ id: string; name: string }>
        sections: Array<{ id: string; name: string }>
        subjects: Array<{ id: string; name: string }>
    }>({ classes: [], sections: [], subjects: [] })
    const [formLoading, setFormLoading] = useState(false)

    useEffect(() => {
        fetchAssignments()
    }, [])

    const fetchAssignments = async () => {
        setLoading(true)
        axiosInstance
            .get("/api/academic/assignment/")
            .then((response) => {
                const data = response.data
                setAssignments(data)
            })
            .catch((error) => {
                console.error("Error fetching assignments:", error)
                toast.error("Failed to fetch assignments")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const filteredAssignments = assignments.filter((assignment) => {
        const matchesSearch =
            assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "expired" && isPast(new Date(assignment.due_date)) && assignment.is_active) ||
            (statusFilter === "active" && assignment.is_active) ||
            (statusFilter === "inactive" && !assignment.is_active)

        const matchesSubject = subjectFilter === "all" || assignment.subject.id === subjectFilter

        const matchesClass = classFilter === "all" || assignment.school_class.id === classFilter

        const matchesSection = sectionFilter === "all" || assignment.section?.name === sectionFilter

        const matchesTab =
            activeTab === "all" ||
            (activeTab === "active" && assignment.is_active) ||
            (activeTab === "inactive" && !assignment.is_active) ||
            (activeTab === "draft" && !assignment.is_active) // Assuming draft means inactive

        return matchesSearch && matchesStatus && matchesSubject && matchesClass && matchesSection && matchesTab
    })

    // Get unique subjects, classes, and sections for filters
    const subjects = [...new Map(assignments.map((item) => [item.subject.id, item.subject])).values()]
    const classes = [...new Map(assignments.map((item) => [item.school_class.id, item.school_class])).values()]
    const sections = [
        ...new Map(
            assignments.filter((item) => item.section?.name).map((item) => [item.section?.name, item.section]),
        ).values(),
    ]

    // Stats for dashboard cards
    const activeAssignments = assignments.filter((a) => a.is_active).length
    const inactiveAssignments = assignments.filter((a) => !a.is_active).length
    const draftAssignments = 0 // Since the interface doesn't have a draft status, set to 0 or remove
    const totalAssignments = assignments.length

    const handleDeleteAssignment = async (id: string) => {
        axiosInstance.delete(`/api/academic/assignment/${id}/`)
            .then(() => {
                setAssignments(assignments.filter((assignment) => assignment.id !== id))
                toast.success("Assignment deleted successfully")
            })
            .catch((error) => {
                console.error("Error deleting assignment:", error)
            })
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
                const newStatus = !assignmentToUpdate.is_active


                setAssignments(
                    assignments.map((assignment) =>
                        assignment.id === id ? { ...assignment, is_active: newStatus } : assignment,
                    ),
                )

                toast.success(`Assignment ${newStatus ? "activated" : "deactivated"} successfully`)
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

    const fetchFormData = async () => {
        setFormLoading(true)
        axiosInstance
            .get("/api/academic/assignment-form-get/")
            .then((response) => {
                const data = response.data

                const classes = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                }))

                const sections = data.reduce((acc: any[], item: any) => {
                    return acc.concat(item.section || [])
                }, [])

                const subjects = data.reduce((acc: any[], item: any) => {
                    return acc.concat(item.subjects || [])
                }, [])

                const uniqueSections = sections.filter(
                    (section, index, self) => index === self.findIndex((s) => s.id === section.id),
                )

                const uniqueSubjects = subjects.filter(
                    (subject, index, self) => index === self.findIndex((s) => s.id === subject.id),
                )

                setFormData({
                    classes,
                    sections: uniqueSections,
                    subjects: uniqueSubjects,
                })
            })
            .catch((error) => {
                console.error("Error fetching form data:", error)
            })
            .finally(() => {
                setFormLoading(false)
            })
    }

    const handleSubmitAssignment = async () => {
        try {
            if (
                !newAssignment.title ||
                !newAssignment.description ||
                !newAssignment.subjectId ||
                !newAssignment.classId ||
                !newAssignment.sectionId
            ) {
                toast.error("Please fill in all required fields")
                return
            }

            const formData = new FormData()
            formData.append("title", newAssignment.title)
            formData.append("description", newAssignment.description)
            formData.append("due_date", newAssignment.dueDate.toISOString().split("T")[0]) // Format as YYYY-MM-DD
            formData.append("school_class", newAssignment.classId)
            formData.append("subject", newAssignment.subjectId)
            formData.append("is_active", newAssignment.status === "active" ? "true" : "false")
            formData.append("section", newAssignment.sectionId)

            if (attachments.length > 0) {
                formData.append("file", attachments[0])
            }

            await axiosInstance.post("/api/academic/assignment/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            fetchAssignments();
            setIsAddDialogOpen(false);
            setNewAssignment({
                title: "",
                description: "",
                subjectId: "",
                classId: "",
                sectionId: "",
                dueDate: new Date(),
                status: "active",
            })
            toast.success("Assignment created successfully")
        } catch (error) {
            console.error("Error creating assignment:", error)
            toast.error("Failed to create assignment")
        }
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            {
                role == "teacher" ? (
                    <PageHeader
                        title="Assignments"
                        breadcrumbs={[
                            { label: "Dashboard", href: "/" },
                            { label: "Assignments", href: "/assignment/list" },
                        ]}
                        onRefresh={fetchAssignments}
                        primaryAction={{
                            label: "Create Assignment",
                            onClick: () => {
                                setIsAddDialogOpen(true)
                                fetchFormData()
                            },
                            icon: <PlusCircle className="h-4 w-4" />,
                        }}
                    />
                ) : (
                    <PageHeader
                        title="Assignments"
                        breadcrumbs={[
                            { label: "Dashboard", href: "/" },
                            { label: "Assignments", href: "/assignment/list" },
                        ]}
                        onRefresh={fetchAssignments}
                    />
                )
            }

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
                        <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assignments.reduce((sum, a) => sum + a.total_submissions, 0)}</div>
                        <p className="text-xs text-muted-foreground">Total submissions received</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
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

                <TabsContent value="all" className="mt-0">
                    <TeacherAssignmentCard
                        assignments={filteredAssignments}
                        loading={loading}
                        onDelete={handleDeleteAssignment}
                        onView={(id) => navigate(`/assignment/detail/${id}`)}
                        onEdit={(id) => navigate(`/assignment/edit/${id}`)}
                        role={`${role}`}
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
                    {formLoading ? (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Title <span className="text-red-500">*</span>
                                </Label>
                                <Skeleton className="h-10 w-full col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description <span className="text-red-500">*</span>
                                </Label>
                                <Skeleton className="h-24 w-full col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="subject" className="text-right">
                                    Subject <span className="text-red-500">*</span>
                                </Label>
                                <Skeleton className="h-10 w-full col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="class" className="text-right">
                                    Class <span className="text-red-500">*</span>
                                </Label>
                                <Skeleton className="h-10 w-full col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="section" className="text-right">
                                    Section
                                </Label>
                                <Skeleton className="h-10 w-full col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dueDate" className="text-right">
                                    Due Date <span className="text-red-500">*</span>
                                </Label>
                                <Skeleton className="h-10 w-full col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                    Status
                                </Label>
                                <Skeleton className="h-10 w-full col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="attachments" className="text-right pt-2">
                                    Attachments
                                </Label>
                                <Skeleton className="h-10 w-full col-span-3" />
                            </div>
                        </div>
                    ) : (
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
                                    <SelectTrigger className="col-span-3 w-full">
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(formData.subjects || []).map((subject) => (
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
                                    <SelectTrigger className="col-span-3 w-full">
                                        <SelectValue placeholder="Select a class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(formData.classes || []).map((cls) => (
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
                                    Section <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={newAssignment.sectionId}
                                    onValueChange={(value) => setNewAssignment((prev) => ({ ...prev, sectionId: value }))}
                                >
                                    <SelectTrigger className="col-span-3 w-full">
                                        <SelectValue placeholder="Select a section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(formData.sections || []).map((section) => (
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
                                    <SelectTrigger className="col-span-3 w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
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
                    )}
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
