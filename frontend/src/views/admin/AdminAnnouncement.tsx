"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import {
    PlusCircle,
    Filter,
    Search,
    Calendar,
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Users,
    Globe,
    Paperclip,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/ListPage/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// Announcement interface
interface Announcement {
    id: string
    title: string
    description: string
    createdAt: string
    publishedAt: string
    expiresAt?: string
    status: "published" | "draft" | "expired"
    isPublic: boolean
    class?: {
        id: string
        name: string
    }
    section?: {
        id: string
        name: string
    }
    createdBy: {
        id: string
        name: string
        role: string
    }
    priority: "normal" | "important" | "urgent"
    attachments?: {
        id: string
        name: string
        type: string
        url: string
    }[]
}

// Dummy data for classes and sections
const classes = [
    { id: "class-all", name: "All Classes" },
    { id: "class-9", name: "Class 9" },
    { id: "class-10", name: "Class 10" },
    { id: "class-11", name: "Class 11" },
    { id: "class-12", name: "Class 12" },
]

const sections = [
    { id: "section-all", name: "All Sections" },
    { id: "section-a", name: "Section A" },
    { id: "section-b", name: "Section B" },
    { id: "section-c", name: "Section C" },
    { id: "section-d", name: "Section D" },
]

// Dummy data for announcements
const dummyAnnouncements: Announcement[] = [
    {
        id: "ann-1",
        title: "School Annual Day Celebration",
        description:
            "We are excited to announce our Annual Day Celebration on December 15th. All students are required to participate in the cultural events. Parents are cordially invited to attend the function starting at 5:00 PM in the school auditorium.",
        createdAt: "2025-05-01T10:30:00Z",
        publishedAt: "2025-05-01T12:00:00Z",
        status: "published",
        isPublic: true,
        createdBy: {
            id: "user-1",
            name: "Principal Johnson",
            role: "Principal",
        },
        priority: "important",
        attachments: [
            {
                id: "att-1",
                name: "annual_day_schedule.pdf",
                type: "application/pdf",
                url: "#",
            },
        ],
    },
    {
        id: "ann-2",
        title: "Mathematics Olympiad Registration",
        description:
            "Registration for the National Mathematics Olympiad is now open. Interested students from classes 9-12 can register through their mathematics teachers. The preliminary round will be held on June 10th.",
        createdAt: "2025-05-03T09:15:00Z",
        publishedAt: "2025-05-03T11:00:00Z",
        status: "published",
        isPublic: false,
        class: {
            id: "class-9",
            name: "Class 9",
        },
        section: {
            id: "section-a",
            name: "Section A",
        },
        createdBy: {
            id: "user-2",
            name: "Ms. Williams",
            role: "Mathematics Department Head",
        },
        priority: "normal",
    },
    {
        id: "ann-3",
        title: "Parent-Teacher Meeting",
        description:
            "The Parent-Teacher Meeting for this semester will be held on May 20th from 9:00 AM to 2:00 PM. Parents are requested to book their slots in advance through the school portal.",
        createdAt: "2025-05-05T14:20:00Z",
        publishedAt: "2025-05-05T16:00:00Z",
        status: "published",
        isPublic: true,
        createdBy: {
            id: "user-3",
            name: "Admin Office",
            role: "Administration",
        },
        priority: "important",
        attachments: [
            {
                id: "att-2",
                name: "ptm_schedule.pdf",
                type: "application/pdf",
                url: "#",
            },
        ],
    },
    {
        id: "ann-4",
        title: "Science Project Submission Deadline",
        description:
            "This is a reminder that the Science Project submissions for Class 10 are due on May 25th. Please ensure that all project reports are submitted in both digital and physical formats as per the guidelines shared earlier.",
        createdAt: "2025-05-10T11:30:00Z",
        publishedAt: "2025-05-10T13:00:00Z",
        status: "published",
        isPublic: false,
        class: {
            id: "class-10",
            name: "Class 10",
        },
        createdBy: {
            id: "user-4",
            name: "Dr. Roberts",
            role: "Science Department Head",
        },
        priority: "urgent",
    },
    {
        id: "ann-5",
        title: "Holiday Notice: Founder's Day",
        description:
            "The school will remain closed on May 30th on account of Founder's Day. Special assembly and celebrations will be held on May 29th, and all students are expected to attend in formal uniform.",
        createdAt: "2025-05-15T08:45:00Z",
        publishedAt: "2025-05-15T10:00:00Z",
        status: "published",
        isPublic: true,
        createdBy: {
            id: "user-1",
            name: "Principal Johnson",
            role: "Principal",
        },
        priority: "normal",
    },
    {
        id: "ann-6",
        title: "Sports Day Tryouts",
        description:
            "Tryouts for the Annual Sports Day will begin next week. Students interested in participating should register with their Physical Education teachers by Friday.",
        createdAt: "2025-05-18T13:10:00Z",
        publishedAt: "",
        status: "draft",
        isPublic: true,
        createdBy: {
            id: "user-5",
            name: "Mr. Thompson",
            role: "Physical Education Head",
        },
        priority: "normal",
    },
    {
        id: "ann-7",
        title: "Class 12 Pre-Board Examination Schedule",
        description:
            "The Pre-Board Examinations for Class 12 will commence from June 5th. The detailed schedule has been attached. Students are advised to prepare accordingly and ensure they have completed all their practical submissions.",
        createdAt: "2025-05-20T09:30:00Z",
        publishedAt: "2025-05-20T11:00:00Z",
        status: "published",
        isPublic: false,
        class: {
            id: "class-12",
            name: "Class 12",
        },
        createdBy: {
            id: "user-6",
            name: "Mrs. Davis",
            role: "Examination Coordinator",
        },
        priority: "urgent",
        attachments: [
            {
                id: "att-3",
                name: "pre_board_schedule.pdf",
                type: "application/pdf",
                url: "#",
            },
        ],
    },
    {
        id: "ann-8",
        title: "Library Book Return Notice",
        description:
            "All students are requested to return their library books before the end of the term. Any unreturned books will result in fines and may affect the issuance of report cards.",
        createdAt: "2025-05-22T15:45:00Z",
        publishedAt: "2025-05-22T16:30:00Z",
        expiresAt: "2025-05-01T00:00:00Z",
        status: "expired",
        isPublic: true,
        createdBy: {
            id: "user-7",
            name: "Ms. Clark",
            role: "Librarian",
        },
        priority: "important",
    },
]

export default function AdminAnnouncementPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [classFilter, setClassFilter] = useState<string>("class-all")
    const [sectionFilter, setSectionFilter] = useState<string>("section-all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [priorityFilter, setPriorityFilter] = useState<string>("all")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null)

    // Add these state variables after the other useState declarations
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        description: "",
        isPublic: true,
        classId: "",
        sectionId: "",
        priority: "normal",
    })
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        setLoading(true)
        try {
            // In a real application, you would fetch from your API
            // const response = await AxiosInstance.get('/api/admin/announcements/')
            // setAnnouncements(response.data)

            // Using dummy data for now
            setTimeout(() => {
                setAnnouncements(dummyAnnouncements)
                setLoading(false)
            }, 800)
        } catch (error) {
            console.error("Error fetching announcements:", error)
            toast.error("Failed to load announcements. Please try again.")
            setLoading(false)
        }
    }

    // Filter announcements based on search query and filters
    const filteredAnnouncements = announcements.filter((announcement) => {
        const matchesSearch =
            announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            announcement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            announcement.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesClass =
            classFilter === "class-all" ||
            (announcement.isPublic && classFilter === "class-all") ||
            (announcement.class && announcement.class.id === classFilter)

        const matchesSection =
            sectionFilter === "section-all" ||
            (announcement.isPublic && sectionFilter === "section-all") ||
            (announcement.section && announcement.section.id === sectionFilter)

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "public" && announcement.isPublic) ||
            announcement.status === statusFilter

        const matchesPriority = priorityFilter === "all" || announcement.priority === priorityFilter

        return matchesSearch && matchesClass && matchesSection && matchesStatus && matchesPriority
    })

    const confirmDelete = (id: string) => {
        setAnnouncementToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleDeleteAnnouncement = async () => {
        if (!announcementToDelete) return

        try {
            // In a real application, you would call your API
            // await AxiosInstance.delete(`/api/admin/announcements/${announcementToDelete}/`)

            // Update local state
            setAnnouncements(announcements.filter((announcement) => announcement.id !== announcementToDelete))
            toast.success("Announcement deleted successfully")
            setDeleteDialogOpen(false)
            setAnnouncementToDelete(null)
        } catch (error) {
            console.error("Error deleting announcement:", error)
            toast.error("Failed to delete announcement")
        }
    }

    // Stats for dashboard cards
    // const publishedAnnouncements = announcements.filter((a) => a.status === "published").length
    // const draftAnnouncements = announcements.filter((a) => a.status === "draft").length
    // const expiredAnnouncements = announcements.filter((a) => a.status === "expired").length
    // const publicAnnouncements = announcements.filter((a) => a.isPublic).length

    // Get priority badge
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "normal":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        Normal
                    </Badge>
                )
            case "important":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                        Important
                    </Badge>
                )
            case "urgent":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                        Urgent
                    </Badge>
                )
            default:
                return null
        }
    }

    // @ts-expect-error: Unused variable
    const getStatusBadge = (status: string, isPublic: boolean) => {
        if (status === "published") {
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Published
                </Badge>
            )
        } else if (status === "draft") {
            return (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    Draft
                </Badge>
            )
        } else if (status === "expired") {
            return (
                <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    Expired
                </Badge>
            )
        }
        return null
    }

    // Get audience badge
    const getAudienceBadge = (announcement: Announcement) => {
        if (announcement.isPublic) {
            return (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                    <Globe className="h-3.5 w-3.5 mr-1" />
                    Public
                </Badge>
            )
        } else if (announcement.class && announcement.section) {
            return (
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {announcement.class.name} {announcement.section.name}
                </Badge>
            )
        } else if (announcement.class) {
            return (
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {announcement.class.name}
                </Badge>
            )
        }
        return null
    }

    // Add this function before the return statement
    const handleCreateAnnouncement = async () => {
        // Validate form
        const errors: Record<string, string> = {}
        if (!newAnnouncement.title.trim()) {
            errors.title = "Title is required"
        }
        if (!newAnnouncement.description.trim()) {
            errors.description = "Description is required"
        }
        if (!newAnnouncement.isPublic && !newAnnouncement.classId) {
            errors.classId = "Class is required for non-public announcements"
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        try {
            // In a real application, you would call your API
            // const response = await AxiosInstance.post('/api/admin/announcements/', newAnnouncement)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800))

            // Create a new dummy announcement
            const newId = `ann-${Date.now()}`
            const createdAnnouncement: Announcement = {
                id: newId,
                title: newAnnouncement.title,
                description: newAnnouncement.description,
                createdAt: new Date().toISOString(),
                publishedAt: new Date().toISOString(),
                status: "published",
                isPublic: newAnnouncement.isPublic,
                createdBy: {
                    id: "user-1",
                    name: "Current User",
                    role: "Administrator",
                },
                priority: newAnnouncement.priority as "normal" | "important" | "urgent",
                ...(newAnnouncement.isPublic
                    ? {}
                    : {
                        class: classes.find((c) => c.id === newAnnouncement.classId),
                        ...(newAnnouncement.sectionId
                            ? {
                                section: sections.find((s) => s.id === newAnnouncement.sectionId),
                            }
                            : {}),
                    }),
            }

            // Update the announcements list
            setAnnouncements([createdAnnouncement, ...announcements])

            // Reset form and close dialog
            setNewAnnouncement({
                title: "",
                description: "",
                isPublic: true,
                classId: "",
                sectionId: "",
                priority: "normal",
            })
            setFormErrors({})
            setCreateDialogOpen(false)
            toast.success("Announcement created successfully")
        } catch (error) {
            console.error("Error creating announcement:", error)
            toast.error("Failed to create announcement. Please try again.")
        }
    }

    // State variables for view and edit dialogs
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
    const [editFormData, setEditFormData] = useState({
        title: "",
        description: "",
        isPublic: true,
        classId: "",
        sectionId: "",
        priority: "normal",
    })

    // Function to handle viewing an announcement
    const handleViewAnnouncement = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement)
        setViewDialogOpen(true)
    }

    // Function to handle editing an announcement
    const handleEditAnnouncement = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement)
        setEditFormData({
            title: announcement.title,
            description: announcement.description,
            isPublic: announcement.isPublic,
            classId: announcement.class?.id || "",
            sectionId: announcement.section?.id || "",
            priority: announcement.priority,
        })
        setEditDialogOpen(true)
    }

    // Function to handle saving the edited announcement
    const handleSaveEdit = async () => {
        // Validate form
        const errors: Record<string, string> = {}
        if (!editFormData.title.trim()) {
            errors.title = "Title is required"
        }
        if (!editFormData.description.trim()) {
            errors.description = "Description is required"
        }
        if (!editFormData.isPublic && !editFormData.classId) {
            errors.classId = "Class is required for non-public announcements"
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        if (!selectedAnnouncement) return

        try {
            // In a real application, you would call your API to update the announcement
            // await AxiosInstance.put(`/api/admin/announcements/${selectedAnnouncement.id}`, editFormData)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800))

            // Update local state
            setAnnouncements(
                announcements.map((announcement) =>
                    announcement.id === selectedAnnouncement.id
                        ? {
                            ...announcement,
                            title: editFormData.title,
                            description: editFormData.description,
                            isPublic: editFormData.isPublic,
                            class: editFormData.isPublic ? undefined : classes.find((c) => c.id === editFormData.classId),
                            section: editFormData.isPublic ? undefined : sections.find((s) => s.id === editFormData.sectionId),
                            priority: editFormData.priority as "normal" | "important" | "urgent",
                        }
                        : announcement,
                ),
            )

            // Reset form and close dialog
            setEditDialogOpen(false)
            setFormErrors({})
            toast.success("Announcement updated successfully")
        } catch (error) {
            console.error("Error updating announcement:", error)
            toast.error("Failed to update announcement. Please try again.")
        }
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <PageHeader
                title="Announcements"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Admin", href: "/admin" },
                    { label: "Announcements", href: "/admin/announcements" },
                ]}
                onRefresh={fetchAnnouncements}
                onPrint={() => console.log("Printing...")}
                onExport={() => console.log("Exporting...")}
                primaryAction={{
                    label: "Create Announcement",
                    onClick: () => setCreateDialogOpen(true),
                    icon: <PlusCircle className="h-4 w-4" />,
                }}
            />

            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold mr-4">All Announcements</h2>
                        <div className="relative w-full sm:w-[300px]">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search announcements..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2 justify-end">
                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="public">Public Only</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Class Filter */}
                        <Select value={classFilter} onValueChange={setClassFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Class" />
                            </SelectTrigger>
                            <SelectContent>
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
                                {sections.map((section) => (
                                    <SelectItem key={section.id} value={section.id}>
                                        {section.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Priority Filter */}
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="important">Important</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" size="icon" className="h-10 w-10">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {renderAnnouncementList()}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this announcement? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAnnouncement}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add this dialog component at the end of the component, before the final closing braces */}
            {/* Add this right after the Delete Confirmation Dialog */}
            {/* Create Announcement Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Create New Announcement</DialogTitle>
                        <DialogDescription>
                            Fill in the details to create a new announcement. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Enter announcement title"
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                className={cn(formErrors.title && "border-red-500")}
                            />
                            {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Enter announcement description"
                                rows={4}
                                value={newAnnouncement.description}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                                className={cn(formErrors.description && "border-red-500")}
                            />
                            {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="isPublic">Public Announcement</Label>
                            <Switch
                                id="isPublic"
                                checked={newAnnouncement.isPublic}
                                onCheckedChange={(checked) => {
                                    setNewAnnouncement({
                                        ...newAnnouncement,
                                        isPublic: checked,
                                        // Clear class and section if public
                                        ...(checked ? { classId: "", sectionId: "" } : {}),
                                    })
                                }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground -mt-3">
                            {newAnnouncement.isPublic
                                ? "This announcement will be visible to everyone"
                                : "This announcement will only be visible to selected classes/sections"}
                        </p>

                        {!newAnnouncement.isPublic && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="classId">
                                        Class <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={newAnnouncement.classId}
                                        onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, classId: value })}
                                    >
                                        <SelectTrigger id="classId" className={cn(formErrors.classId && "border-red-500")}>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes
                                                .filter((c) => c.id !== "class-all")
                                                .map((cls) => (
                                                    <SelectItem key={cls.id} value={cls.id}>
                                                        {cls.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    {formErrors.classId && <p className="text-sm text-red-500">{formErrors.classId}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="sectionId">Section (Optional)</Label>
                                    <Select
                                        value={newAnnouncement.sectionId}
                                        onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, sectionId: value })}
                                    >
                                        <SelectTrigger id="sectionId">
                                            <SelectValue placeholder="Select section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="section-all">All Sections</SelectItem>
                                            {sections
                                                .filter((s) => s.id !== "section-all")
                                                .map((section) => (
                                                    <SelectItem key={section.id} value={section.id}>
                                                        {section.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={newAnnouncement.priority}
                                onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                            >
                                <SelectTrigger id="priority">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="important">Important</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setCreateDialogOpen(false)
                                setNewAnnouncement({
                                    title: "",
                                    description: "",
                                    isPublic: true,
                                    classId: "",
                                    sectionId: "",
                                    priority: "normal",
                                })
                                setFormErrors({})
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreateAnnouncement}>Create Announcement</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add these dialog components at the end of the component, after the Create Announcement Dialog */}

            {/* View Announcement Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[650px]">
                    <DialogHeader>
                        <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedAnnouncement && (
                                <>
                                    {getStatusBadge(selectedAnnouncement.status, selectedAnnouncement.isPublic)}
                                    {getAudienceBadge(selectedAnnouncement)}
                                    {getPriorityBadge(selectedAnnouncement.priority)}
                                </>
                            )}
                        </div>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="prose prose-sm max-w-none">
                            <p>{selectedAnnouncement?.description}</p>
                        </div>

                        {selectedAnnouncement?.attachments && selectedAnnouncement.attachments.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                                <h4 className="text-sm font-medium mb-2">Attachments</h4>
                                <ul className="space-y-2">
                                    {selectedAnnouncement.attachments.map((attachment) => (
                                        <li key={attachment.id} className="flex items-center text-sm">
                                            <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
                                            <a href={attachment.url} className="text-blue-600 hover:underline">
                                                {attachment.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Created by</p>
                                <p className="font-medium">{selectedAnnouncement?.createdBy.name}</p>
                                <p className="text-xs text-muted-foreground">{selectedAnnouncement?.createdBy.role}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Created at</p>
                                <p className="font-medium">
                                    {selectedAnnouncement && format(new Date(selectedAnnouncement.createdAt), "PPP")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {selectedAnnouncement && format(new Date(selectedAnnouncement.createdAt), "p")}
                                </p>
                            </div>
                            {selectedAnnouncement?.publishedAt && (
                                <div>
                                    <p className="text-muted-foreground">Published at</p>
                                    <p className="font-medium">{format(new Date(selectedAnnouncement.publishedAt), "PPP")}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(selectedAnnouncement.publishedAt), "p")}
                                    </p>
                                </div>
                            )}
                            {selectedAnnouncement?.expiresAt && (
                                <div>
                                    <p className="text-muted-foreground">Expires at</p>
                                    <p className="font-medium">{format(new Date(selectedAnnouncement.expiresAt), "PPP")}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(selectedAnnouncement.expiresAt), "p")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                            Close
                        </Button>

                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Announcement Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Edit Announcement</DialogTitle>
                        <DialogDescription>
                            Make changes to the announcement details. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-title">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-title"
                                placeholder="Enter announcement title"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                className={cn(formErrors.title && "border-red-500")}
                            />
                            {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="edit-description"
                                placeholder="Enter announcement description"
                                rows={4}
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                className={cn(formErrors.description && "border-red-500")}
                            />
                            {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="edit-isPublic">Public Announcement</Label>
                            <Switch
                                id="edit-isPublic"
                                checked={editFormData.isPublic}
                                onCheckedChange={(checked) => {
                                    setEditFormData({
                                        ...editFormData,
                                        isPublic: checked,
                                        // Clear class and section if public
                                        ...(checked ? { classId: "", sectionId: "" } : {}),
                                    })
                                }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground -mt-3">
                            {editFormData.isPublic
                                ? "This announcement will be visible to everyone"
                                : "This announcement will only be visible to selected classes/sections"}
                        </p>

                        {!editFormData.isPublic && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-classId">
                                        Class <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={editFormData.classId}
                                        onValueChange={(value) => setEditFormData({ ...editFormData, classId: value })}
                                    >
                                        <SelectTrigger id="edit-classId" className={cn(formErrors.classId && "border-red-500")}>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes
                                                .filter((c) => c.id !== "class-all")
                                                .map((cls) => (
                                                    <SelectItem key={cls.id} value={cls.id}>
                                                        {cls.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    {formErrors.classId && <p className="text-sm text-red-500">{formErrors.classId}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-sectionId">Section (Optional)</Label>
                                    <Select
                                        value={editFormData.sectionId}
                                        onValueChange={(value) => setEditFormData({ ...editFormData, sectionId: value })}
                                    >
                                        <SelectTrigger id="edit-sectionId">
                                            <SelectValue placeholder="Select section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="section-all">All Sections</SelectItem>
                                            {sections
                                                .filter((s) => s.id !== "section-all")
                                                .map((section) => (
                                                    <SelectItem key={section.id} value={section.id}>
                                                        {section.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="edit-priority">Priority</Label>
                            <Select
                                value={editFormData.priority}
                                onValueChange={(value) => setEditFormData({ ...editFormData, priority: value })}
                            >
                                <SelectTrigger id="edit-priority">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="important">Important</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setEditDialogOpen(false)
                                setFormErrors({})
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )

    function renderAnnouncementList() {
        if (loading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden flex flex-col min-h-[320px] animate-pulse">
                            <CardHeader className="pb-2">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2 flex-grow">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6 mb-2" />
                                <Skeleton className="h-4 w-4/6" />
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )
        }

        if (filteredAnnouncements.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 min-h-[320px]">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
                    <p className="text-gray-500 mb-4 text-center">
                        There are no announcements matching your current filters. Try adjusting your search or create a new
                        announcement.
                    </p>
                    <Button onClick={() => setCreateDialogOpen(true)}>Create New Announcement</Button>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAnnouncements.map((announcement) => (
                    <Card
                        key={announcement.id}
                        className={cn(
                            "overflow-hidden hover:shadow-md transition-shadow flex flex-col min-h-[320px]",
                            announcement.status === "draft" && "bg-gray-50 border-gray-200",
                            announcement.status === "expired" && "bg-red-50 border-red-200",
                        )}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="font-medium text-lg line-clamp-2 hover:line-clamp-none cursor-pointer">
                                    {announcement.title}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleViewAnnouncement(announcement)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEditAnnouncement(announcement)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit Announcement
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => confirmDelete(announcement.id)}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {getStatusBadge(announcement.status, announcement.isPublic)}
                                {getAudienceBadge(announcement)}
                                {getPriorityBadge(announcement.priority)}
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                            <p className="text-gray-600 text-sm line-clamp-4">{announcement.description}</p>

                            {announcement.attachments && announcement.attachments.length > 0 && (
                                <div className="mt-3">
                                    <div className="flex items-center text-sm">
                                        <Paperclip className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                        <span className="text-gray-600">
                      {announcement.attachments.length} attachment{announcement.attachments.length !== 1 ? "s" : ""}
                    </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2 border-t">
                            <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>
                  {announcement.status === "published"
                      ? `Published: ${format(new Date(announcement.publishedAt), "MMM d, yyyy")}`
                      : `Created: ${format(new Date(announcement.createdAt), "MMM d, yyyy")}`}
                </span>
                            </div>
                            <div className="text-xs text-gray-500">By: {announcement.createdBy.name}</div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }
}
