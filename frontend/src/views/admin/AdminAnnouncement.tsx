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
import axiosInstance from "@/auth/AxiosInstance.ts"
import {useAuthStore} from "@/store/AuthStore.ts";

interface SchoolClass {
    id: string
    name: string
}

interface Announcement {
    id: string
    school_class: SchoolClass | null
    public_access: boolean
    priority: "important" | "normal" | "urgent"
    is_expired: boolean
    title: string
    description: string
    created_at: string
    updated_at: string
    academic_year: string
}

export default function AdminAnnouncementPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [classFilter, setClassFilter] = useState<string>("all")
    const [sectionFilter] = useState<string>("section-all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [priorityFilter, setPriorityFilter] = useState<string>("all")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null)
    const [classes, setClasses] = useState<SchoolClass[]>([{ id: "all", name: "All Classes" }])

    // State variables for dialogs
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    const {role} = useAuthStore()

    // Form data for new announcement
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        description: "",
        public_access: true,
        school_class_id: "",
        priority: "normal" as "normal" | "important" | "urgent",
    })

    // Form data for editing announcement
    const [editFormData, setEditFormData] = useState({
        title: "",
        description: "",
        public_access: true,
        school_class_id: "",
        priority: "normal" as "normal" | "important" | "urgent",
    })

    useEffect(() => {
        fetchAnnouncements()
        fetchClasses()
    }, [])

    const fetchAnnouncements = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get("/api/academic/announcement/")
            setAnnouncements(response.data)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching announcements:", error)
            toast.error("Failed to load announcements. Please try again.")
            setLoading(false)
        }
    }

    const fetchClasses = async () => {
        try {
            const response = await axiosInstance.get("/api/academic/class-list/")
            // Add the "All Classes" option to the beginning of the array
            setClasses([{ id: "all", name: "All Classes" }, ...response.data])
        } catch (error) {
            console.error("Error fetching classes:", error)
            toast.error("Failed to load classes. Please try again.")
        }
    }

    // Filter announcements based on search query and filters
    const filteredAnnouncements = announcements.filter((announcement) => {
        const matchesSearch =
            announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            announcement.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesClass =
            classFilter === "all" ||
            (announcement.public_access && classFilter === "all") ||
            (announcement.school_class && announcement.school_class.id === classFilter)

        const matchesSection = sectionFilter === "section-all"

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "public" && announcement.public_access) ||
            (statusFilter === "expired" && announcement.is_expired) ||
            (statusFilter === "active" && !announcement.is_expired)

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
            await axiosInstance.delete(`/api/academic/announcement/${announcementToDelete}/`)
            fetchAnnouncements()
            toast.success("Announcement deleted successfully")
            setDeleteDialogOpen(false)
            setAnnouncementToDelete(null)
        } catch (error) {
            console.error("Error deleting announcement:", error)
            toast.error("Failed to delete announcement")
        }
    }

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

    // Get status badge
    const getStatusBadge = (isExpired: boolean) => {
        if (isExpired) {
            return (
                <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    Expired
                </Badge>
            )
        } else {
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Active
                </Badge>
            )
        }
    }

    // Get audience badge
    const getAudienceBadge = (announcement: Announcement) => {
        if (announcement.public_access) {
            return (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                    <Globe className="h-3.5 w-3.5 mr-1" />
                    Public
                </Badge>
            )
        } else if (announcement.school_class) {
            return (
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {announcement.school_class.name}
                </Badge>
            )
        }
        return null
    }

    // Function to handle creating a new announcement
    const handleCreateAnnouncement = async () => {
        // Validate form
        const errors: Record<string, string> = {}
        if (!newAnnouncement.title.trim()) {
            errors.title = "Title is required"
        }
        if (!newAnnouncement.description.trim()) {
            errors.description = "Description is required"
        }
        if (!newAnnouncement.public_access && !newAnnouncement.school_class_id) {
            errors.school_class_id = "Class is required for non-public announcements"
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        try {
            const payload = {
                title: newAnnouncement.title,
                description: newAnnouncement.description,
                public_access: newAnnouncement.public_access,
                priority: newAnnouncement.priority,
                school_class: newAnnouncement.public_access ? null : newAnnouncement.school_class_id,
            }

            await axiosInstance.post("/api/academic/announcement/", payload)
            fetchAnnouncements()
            setFormErrors({})
            setCreateDialogOpen(false)
            toast.success("Announcement created successfully")
        } catch (error) {
            console.error("Error creating announcement:", error)
            toast.error("Failed to create announcement. Please try again.")
        }
    }

    const handleViewAnnouncement = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement)
        setViewDialogOpen(true)
    }

    const handleEditAnnouncement = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement)
        setEditFormData({
            title: announcement.title,
            description: announcement.description,
            public_access: announcement.public_access,
            school_class_id: announcement.school_class?.id || "",
            priority: announcement.priority,
        })
        setEditDialogOpen(true)
    }

    const handleSaveEdit = async () => {
        // Validate form
        const errors: Record<string, string> = {}
        if (!editFormData.title.trim()) {
            errors.title = "Title is required"
        }
        if (!editFormData.description.trim()) {
            errors.description = "Description is required"
        }
        if (!editFormData.public_access && !editFormData.school_class_id) {
            errors.school_class_id = "Class is required for non-public announcements"
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        if (!selectedAnnouncement) return

        try {
            const payload = {
                title: editFormData.title,
                description: editFormData.description,
                public_access: editFormData.public_access,
                priority: editFormData.priority,
                school_class: editFormData.public_access ? null : editFormData.school_class_id,
            }

            await axiosInstance.put(`/api/academic/announcement/${selectedAnnouncement.id}/`, payload)
            fetchAnnouncements()
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
            {
                role == "student" || role == "parent" ? (
                    <PageHeader
                        title="Announcements"
                        breadcrumbs={[
                            { label: "Dashboard", href: "/" },
                            { label: "Announcements", href: "/announcement/list" },
                        ]}
                        onRefresh={fetchAnnouncements}
                    />
                ): (
                    <PageHeader
                        title="Announcements"
                        breadcrumbs={[
                            { label: "Dashboard", href: "/" },
                            { label: "Announcements", href: "/announcement/list" },
                        ]}
                        onRefresh={fetchAnnouncements}
                        primaryAction={{
                            label: "Create Announcement",
                            onClick: () => setCreateDialogOpen(true),
                            icon: <PlusCircle className="h-4 w-4" />,
                        }}
                    />
                )
            }

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
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="public">Public Only</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Class Filter */}
                        {
                            role == "student" || role == "parent" ? null : (
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
                            )
                        }

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
                            <Label htmlFor="public_access">Public Announcement</Label>
                            <Switch
                                id="public_access"
                                checked={newAnnouncement.public_access}
                                onCheckedChange={(checked) => {
                                    setNewAnnouncement({
                                        ...newAnnouncement,
                                        public_access: checked,
                                        // Clear class if public
                                        ...(checked ? { school_class_id: "" } : {}),
                                    })
                                }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground -mt-3">
                            {newAnnouncement.public_access
                                ? "This announcement will be visible to everyone"
                                : "This announcement will only be visible to selected class"}
                        </p>

                        {!newAnnouncement.public_access && (
                            <div className="grid gap-2">
                                <Label htmlFor="school_class_id">
                                    Class <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={newAnnouncement.school_class_id}
                                    onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, school_class_id: value })}
                                >
                                    <SelectTrigger
                                        id="school_class_id"
                                        className={"w-full" + cn(formErrors.school_class_id && "border-red-500")}
                                    >
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes
                                            .filter((c) => c.id !== "all")
                                            .map((cls) => (
                                                <SelectItem key={cls.id} value={cls.id}>
                                                    {cls.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {formErrors.school_class_id && <p className="text-sm text-red-500">{formErrors.school_class_id}</p>}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={newAnnouncement.priority}
                                onValueChange={(value: "normal" | "important" | "urgent") =>
                                    setNewAnnouncement({ ...newAnnouncement, priority: value })
                                }
                            >
                                <SelectTrigger id="priority" className={"w-full"}>
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
                                    public_access: true,
                                    school_class_id: "",
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

            {/* View Announcement Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[650px]">
                    <DialogHeader>
                        <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedAnnouncement && (
                                <>
                                    {/*@ts-expect-error: type error*/}
                                    {getStatusBadge(selectedAnnouncement.is_expired, selectedAnnouncement?.public_access)}
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

                        <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Created at</p>
                                <p className="font-medium">
                                    {selectedAnnouncement && format(new Date(selectedAnnouncement.created_at), "PPP")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {selectedAnnouncement && format(new Date(selectedAnnouncement.created_at), "p")}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Updated at</p>
                                <p className="font-medium">
                                    {selectedAnnouncement && format(new Date(selectedAnnouncement.updated_at), "PPP")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {selectedAnnouncement && format(new Date(selectedAnnouncement.updated_at), "p")}
                                </p>
                            </div>
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
                            <Label htmlFor="edit-public_access">Public Announcement</Label>
                            <Switch
                                id="edit-public_access"
                                checked={editFormData.public_access}
                                onCheckedChange={(checked) => {
                                    setEditFormData({
                                        ...editFormData,
                                        public_access: checked,
                                        // Clear class if public
                                        ...(checked ? { school_class_id: "" } : {}),
                                    })
                                }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground -mt-3">
                            {editFormData.public_access
                                ? "This announcement will be visible to everyone"
                                : "This announcement will only be visible to selected class"}
                        </p>

                        {!editFormData.public_access && (
                            <div className="grid gap-2">
                                <Label htmlFor="edit-school_class_id">
                                    Class <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={editFormData.school_class_id}
                                    onValueChange={(value) => setEditFormData({ ...editFormData, school_class_id: value })}
                                >
                                    <SelectTrigger
                                        id="edit-school_class_id"
                                        className={"w-full" + cn(formErrors.school_class_id && "border-red-500")}
                                    >
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes
                                            .filter((c) => c.id !== "all")
                                            .map((cls) => (
                                                <SelectItem key={cls.id} value={cls.id}>
                                                    {cls.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {formErrors.school_class_id && <p className="text-sm text-red-500">{formErrors.school_class_id}</p>}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="edit-priority">Priority</Label>
                            <Select
                                value={editFormData.priority}
                                onValueChange={(value: "normal" | "important" | "urgent") =>
                                    setEditFormData({ ...editFormData, priority: value })
                                }
                            >
                                <SelectTrigger id="edit-priority" className={'w-full'}>
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
                <div className="flex flex-col items-center justify-center p-8 rounded-lg min-h-[320px]">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
                    <p className="text-gray-500 mb-4 text-center">
                        There are no announcements matching your current filters. Try adjusting your search or create a new
                        announcement.
                    </p>
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
                            announcement.is_expired && "bg-red-50 border-red-200",
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
                                            View
                                        </DropdownMenuItem>
                                        {
                                            role == "student" || role == "parent" ? null : (
                                                <>
                                                    <DropdownMenuItem onClick={() => handleEditAnnouncement(announcement)}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => confirmDelete(announcement.id)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </>
                                            )
                                        }
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {/*@ts-expect-error: type error*/}
                                {getStatusBadge(announcement.is_expired, announcement?.public_access)}
                                {getAudienceBadge(announcement)}
                                {getPriorityBadge(announcement.priority)}
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                            <p className="text-gray-600 text-sm line-clamp-4">{announcement.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2 border-t">
                            <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{format(new Date(announcement.created_at), "MMM d, yyyy")}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                Last updated: {format(new Date(announcement.updated_at), "MMM d, yyyy")}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }
}
