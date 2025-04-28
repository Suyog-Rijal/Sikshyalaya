"use client"

import React, { useState } from "react"

import { Search, Filter, Plus, Trash, Edit, AlertCircle } from "lucide-react"
import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

// Types
type ClassOption = {
    id: string
    name: string
    sections: SectionOption[]
}

type SectionOption = {
    id: string
    name: string
}

type AnnouncementPriority = "low" | "medium" | "high"

type Announcement = {
    id: string
    title: string
    description: string
    classId: string
    sectionId: string
    createdAt: Date
    priority: AnnouncementPriority
}

// Mock data for teacher's classes
const teacherClasses: ClassOption[] = [
    {
        id: "class-1",
        name: "Mathematics",
        sections: [
            { id: "section-1", name: "Section A" },
            { id: "section-2", name: "Section B" },
        ],
    },
    {
        id: "class-2",
        name: "Physics",
        sections: [
            { id: "section-3", name: "Section A" },
            { id: "section-4", name: "Section B" },
        ],
    },
    {
        id: "class-3",
        name: "Chemistry",
        sections: [
            { id: "section-5", name: "Section A" },
            { id: "section-6", name: "Section B" },
        ],
    },
]

// Mock data for announcements
const mockAnnouncements: Announcement[] = [
    {
        id: "1",
        title: "Quiz Next Week",
        description: "There will be a quiz on Chapter 5 next Monday. Please prepare accordingly.",
        classId: "class-1",
        sectionId: "section-1",
        createdAt: new Date("2023-04-10T10:00:00"),
        priority: "high",
    },
    {
        id: "2",
        title: "Homework Submission",
        description: "Please submit your homework by Friday. Late submissions will not be accepted.",
        classId: "class-2",
        sectionId: "section-3",
        createdAt: new Date("2023-04-08T14:30:00"),
        priority: "medium",
    },
    {
        id: "3",
        title: "Lab Session Rescheduled",
        description: "The lab session scheduled for Wednesday has been moved to Thursday.",
        classId: "class-3",
        sectionId: "section-5",
        createdAt: new Date("2023-04-05T09:15:00"),
        priority: "low",
    },
]

export default function TeacherAnnouncementPage() {
    // State for announcements
    const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
    const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(mockAnnouncements)

    // State for filters
    const [searchQuery, setSearchQuery] = useState("")
    const [classFilter, setClassFilter] = useState("")
    const [sectionFilter, setSectionFilter] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("")

    // State for create dialog
    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    // State for form
    const [formTitle, setFormTitle] = useState("")
    const [formDescription, setFormDescription] = useState("")
    const [formClassId, setFormClassId] = useState("")
    const [formSectionId, setFormSectionId] = useState("")
    const [formPriority, setFormPriority] = useState<AnnouncementPriority>("medium")

    // State for form errors
    const [formErrors, setFormErrors] = useState({
        title: false,
        description: false,
        classId: false,
        sectionId: false,
    })

    // Get available sections based on selected class
    const getAvailableSections = () => {
        if (!formClassId) return []
        const selectedClass = teacherClasses.find((c) => c.id === formClassId)
        return selectedClass ? selectedClass.sections : []
    }

    // Filter announcements based on search and filters
    const filterAnnouncements = () => {
        let filtered = [...announcements]

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (announcement) =>
                    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    announcement.description.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        // Apply class filter
        if (classFilter) {
            filtered = filtered.filter((announcement) => announcement.classId === classFilter)
        }

        // Apply section filter
        if (sectionFilter) {
            filtered = filtered.filter((announcement) => announcement.sectionId === sectionFilter)
        }

        // Apply priority filter
        if (priorityFilter) {
            filtered = filtered.filter((announcement) => announcement.priority === priorityFilter)
        }

        setFilteredAnnouncements(filtered)
    }

    // Handle search and filter changes
    React.useEffect(() => {
        filterAnnouncements()
    }, [searchQuery, classFilter, sectionFilter, priorityFilter, announcements])

    // Reset form
    const resetForm = () => {
        setFormTitle("")
        setFormDescription("")
        setFormClassId("")
        setFormSectionId("")
        setFormPriority("medium")
        setFormErrors({
            title: false,
            description: false,
            classId: false,
            sectionId: false,
        })
    }

    // Handle form submission
    const handleCreateAnnouncement = () => {
        // Validate form
        const errors = {
            title: !formTitle.trim(),
            description: !formDescription.trim(),
            classId: !formClassId,
            sectionId: !formSectionId,
        }

        setFormErrors(errors)

        // Check if there are any errors
        if (Object.values(errors).some((error) => error)) {
            return
        }

        // Create new announcement
        const newAnnouncement: Announcement = {
            id: Date.now().toString(),
            title: formTitle,
            description: formDescription,
            classId: formClassId,
            sectionId: formSectionId,
            createdAt: new Date(),
            priority: formPriority,
        }

        // Add to announcements
        setAnnouncements((prev) => [newAnnouncement, ...prev])

        // Reset form and close dialog
        resetForm()
        setCreateDialogOpen(false)
    }

    // Handle delete announcement
    const handleDeleteAnnouncement = (id: string) => {
        setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id))
    }

    // Get class name by ID
    const getClassName = (classId: string) => {
        const foundClass = teacherClasses.find((c) => c.id === classId)
        return foundClass ? foundClass.name : "Unknown Class"
    }

    // Get section name by ID
    const getSectionName = (classId: string, sectionId: string) => {
        const foundClass = teacherClasses.find((c) => c.id === classId)
        if (!foundClass) return "Unknown Section"

        const foundSection = foundClass.sections.find((s) => s.id === sectionId)
        return foundSection ? foundSection.name : "Unknown Section"
    }

    // Render priority badge
    const renderPriorityBadge = (priority: AnnouncementPriority) => {
        const colorMap = {
            low: "bg-blue-100 text-blue-800",
            medium: "bg-yellow-100 text-yellow-800",
            high: "bg-red-100 text-red-800",
        }

        return <Badge className={`${colorMap[priority]} capitalize`}>{priority}</Badge>
    }

    // Render announcement list
    const renderAnnouncementList = () => {
        if (filteredAnnouncements.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No announcements found</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        {announcements.length === 0
                            ? "You haven't created any announcements yet."
                            : "No announcements match your current filters."}
                    </p>
                    {announcements.length === 0 && (
                        <Button onClick={() => setCreateDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Announcement
                        </Button>
                    )}
                </div>
            )
        }

        return filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="p-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-medium">{announcement.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>
                {getClassName(announcement.classId)} - {getSectionName(announcement.classId, announcement.sectionId)}
              </span>
                            <span>•</span>
                            <span>{announcement.createdAt.toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {renderPriorityBadge(announcement.priority)}
                        <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteAnnouncement(announcement.id)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{announcement.description}</p>
            </Card>
        ))
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Announcements</h1>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Announcement
                </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search announcements..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 ml-auto">
                    <Filter className="h-4 w-4 text-gray-500" />

                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Classes</SelectItem>
                            {teacherClasses.map((classOption) => (
                                <SelectItem key={classOption.id} value={classOption.id}>
                                    {classOption.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sectionFilter} onValueChange={setSectionFilter} disabled={!classFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Section" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Sections</SelectItem>
                            {classFilter &&
                                teacherClasses
                                    .find((c) => c.id === classFilter)
                                    ?.sections.map((section) => (
                                    <SelectItem key={section.id} value={section.id}>
                                        {section.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">{renderAnnouncementList()}</div>

            {/* Create Announcement Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Create New Announcement</DialogTitle>
                        <DialogDescription>Create an announcement for your class. All fields are required.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="flex items-center gap-1">
                                Title
                                {formErrors.title && <span className="text-red-500 text-xs">*Required</span>}
                            </Label>
                            <Input
                                id="title"
                                value={formTitle}
                                onChange={(e: any) => setFormTitle(e.target.value)}
                                className={formErrors.title ? "border-red-500" : ""}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="class" className="flex items-center gap-1">
                                Class
                                {formErrors.classId && <span className="text-red-500 text-xs">*Required</span>}
                            </Label>
                            <Select
                                value={formClassId}
                                onValueChange={(value) => {
                                    setFormClassId(value)
                                    setFormSectionId("") // Reset section when class changes
                                }}
                            >
                                <SelectTrigger className={formErrors.classId ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teacherClasses.map((classOption) => (
                                        <SelectItem key={classOption.id} value={classOption.id}>
                                            {classOption.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="section" className="flex items-center gap-1">
                                Section
                                {formErrors.sectionId && <span className="text-red-500 text-xs">*Required</span>}
                            </Label>
                            <Select value={formSectionId} onValueChange={setFormSectionId} disabled={!formClassId}>
                                <SelectTrigger className={formErrors.sectionId ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select a section" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getAvailableSections().map((section) => (
                                        <SelectItem key={section.id} value={section.id}>
                                            {section.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={formPriority} onValueChange={(value: AnnouncementPriority) => setFormPriority(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description" className="flex items-center gap-1">
                                Description
                                {formErrors.description && <span className="text-red-500 text-xs">*Required</span>}
                            </Label>
                            <Textarea
                                id="description"
                                value={formDescription}
                                onChange={(e: any) => setFormDescription(e.target.value)}
                                className={`min-h-[100px] ${formErrors.description ? "border-red-500" : ""}`}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                resetForm()
                                setCreateDialogOpen(false)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreateAnnouncement}>Create Announcement</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
