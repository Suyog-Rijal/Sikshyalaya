"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { toast } from "sonner"
import { ArrowLeft, Calendar, Clock, Paperclip, Trash2, Upload, Save, AlertCircle, FileText, File } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/ListPage/PageHeader"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {Assignment} from "@/views/teacher/TeacherAssignmentList.tsx";

// Dummy data for a single assignment
const dummyAssignment: Assignment = {
    id: "1",
    title: "Mathematics Problem Set: Algebra Fundamentals",
    description:
        "Complete problems 1-20 in Chapter 3. Show all work and explain your reasoning for each step. This assignment is designed to reinforce your understanding of algebraic concepts including equations, inequalities, and functions. Pay special attention to the word problems at the end of the chapter, which require you to translate real-world scenarios into mathematical expressions.",
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
}

// Dummy data for subjects, classes, and sections
const subjects = [
    { id: "math-101", name: "Mathematics" },
    { id: "sci-102", name: "Science" },
    { id: "eng-103", name: "English" },
    { id: "hist-104", name: "History" },
    { id: "cs-105", name: "Computer Science" },
    { id: "geo-106", name: "Geography" },
    { id: "phys-107", name: "Physics" },
]

const classes = [
    { id: "class-9a", name: "Class 9" },
    { id: "class-9b", name: "Class 9" },
    { id: "class-10a", name: "Class 10" },
    { id: "class-10b", name: "Class 10" },
    { id: "class-11a", name: "Class 11" },
    { id: "class-11b", name: "Class 11" },
    { id: "class-12a", name: "Class 12" },
    { id: "class-12b", name: "Class 12" },
]

const sections = [
    { id: "section-a", name: "Section A" },
    { id: "section-b", name: "Section B" },
    { id: "section-c", name: "Section C" },
    { id: "section-d", name: "Section D" },
]

interface FormData {
    title: string
    description: string
    subjectId: string
    classId: string
    sectionId: string
    dueDate: Date
    status: "active" | "inactive" | "draft"
    attachments: {
        id: string
        name: string
        type: string
        url: string
        isNew?: boolean
        file?: File
    }[]
}

export default function TeacherAssignmentEdit() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        subjectId: "",
        classId: "",
        sectionId: "",
        dueDate: new Date(),
        status: "active",
        attachments: [],
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
    const [deleteAttachmentId, setDeleteAttachmentId] = useState<string | null>(null)

    useEffect(() => {
        fetchAssignmentDetails()
    }, [id])

    const fetchAssignmentDetails = async () => {
        setLoading(true)
        try {
            // In a real application, you would fetch from your API
            // const response = await AxiosInstance.get(`/api/academic/assignments/${id}/`)
            // const assignment = response.data

            // Using dummy data for now
            setTimeout(() => {
                const assignment = dummyAssignment
                setFormData({
                    title: assignment.title,
                    description: assignment.description,
                    subjectId: assignment.subject.id,
                    classId: assignment.class.id,
                    sectionId: assignment.section?.id || "",
                    dueDate: new Date(assignment.dueDate),
                    status: assignment.status,
                    attachments: assignment.attachments,
                })
                setLoading(false)
            }, 800)
        } catch (error) {
            console.error("Error fetching assignment details:", error)
            toast.error("Failed to load assignment details. Please try again.")
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setFormData((prev) => ({ ...prev, dueDate: date }))

            // Clear error when field is edited
            if (errors.dueDate) {
                setErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.dueDate
                    return newErrors
                })
            }
        }
    }

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({ ...prev, status: value as "active" | "inactive" | "draft" }))
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const newAttachments = Array.from(files).map((file) => ({
            id: `new-${Date.now()}-${file.name}`,
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file),
            isNew: true,
            file,
        }))

        setFormData((prev) => ({
            ...prev,
            attachments: [...prev.attachments, ...newAttachments],
        }))
    }

    const handleDeleteAttachment = (attachmentId: string) => {
        setDeleteAttachmentId(attachmentId)
    }

    const confirmDeleteAttachment = () => {
        if (deleteAttachmentId) {
            setFormData((prev) => ({
                ...prev,
                attachments: prev.attachments.filter((att) => att.id !== deleteAttachmentId),
            }))
            setDeleteAttachmentId(null)
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = "Title is required"
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required"
        }

        if (!formData.subjectId) {
            newErrors.subjectId = "Subject is required"
        }

        if (!formData.classId) {
            newErrors.classId = "Class is required"
        }

        if (!formData.dueDate) {
            newErrors.dueDate = "Due date is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error("Please fix the errors in the form")
            return
        }

        setSaving(true)
        try {
            // In a real application, you would call your API
            // For file uploads, you might need to use FormData
            // const formDataToSend = new FormData()
            // formDataToSend.append('title', formData.title)
            // ...
            // formData.attachments.forEach(att => {
            //   if (att.isNew && att.file) {
            //     formDataToSend.append('new_attachments', att.file)
            //   } else {
            //     formDataToSend.append('existing_attachments', att.id)
            //   }
            // })
            // await AxiosInstance.put(`/api/academic/assignments/${id}/`, formDataToSend)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast.success("Assignment updated successfully")
            navigate(`/assignment/detail/${id}`)
        } catch (error) {
            console.error("Error updating assignment:", error)
            toast.error("Failed to update assignment. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        // Check if form has been modified
        const hasChanges =
            formData.title !== dummyAssignment.title ||
            formData.description !== dummyAssignment.description ||
            formData.subjectId !== dummyAssignment.subject.id ||
            formData.classId !== dummyAssignment.class.id ||
            formData.sectionId !== (dummyAssignment.section?.id || "") ||
            formData.status !== dummyAssignment.status ||
            formData.attachments.length !== dummyAssignment.attachments.length ||
            formData.attachments.some((att) => att.isNew)

        if (hasChanges) {
            setDiscardDialogOpen(true)
        } else {
            navigate(`/assignment/detail/${id}`)
        }
    }

    const getFileIcon = (fileType: string) => {
        if (fileType.includes("pdf")) {
            return <FileText className="h-4 w-4 text-red-500" />
        } else if (fileType.includes("word") || fileType.includes("document")) {
            return <FileText className="h-4 w-4 text-blue-500" />
        } else if (fileType.includes("sheet") || fileType.includes("excel")) {
            return <FileText className="h-4 w-4 text-green-500" />
        } else if (fileType.includes("presentation") || fileType.includes("powerpoint")) {
            return <FileText className="h-4 w-4 text-orange-500" />
        } else {
            return <File className="h-4 w-4 text-gray-500" />
        }
    }

    if (loading) {
        return (
            <div className="p-4 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/assignment/detail/${id}`)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Loading assignment...</h1>
                </div>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
                    <div className="h-64 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <PageHeader
                title="Edit Assignment"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Assignments", href: "/assignment/list" },
                    { label: "edit", href: `/assignment/edit/${id}` },
                ]}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Basic Information</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Assignment Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter assignment title"
                                className={cn(errors.title && "border-red-500")}
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter assignment description"
                                rows={5}
                                className={cn(errors.description && "border-red-500")}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">
                                    Subject <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.subjectId} onValueChange={(value) => handleSelectChange("subjectId", value)}>
                                    <SelectTrigger id="subject" className={cn(errors.subjectId && "border-red-500")}>
                                        <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.subjectId && <p className="text-sm text-red-500">{errors.subjectId}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="class">
                                    Class <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.classId} onValueChange={(value) => handleSelectChange("classId", value)}>
                                    <SelectTrigger id="class" className={cn(errors.classId && "border-red-500")}>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.classId && <p className="text-sm text-red-500">{errors.classId}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="section">Section</Label>
                                <Select value={formData.sectionId} onValueChange={(value) => handleSelectChange("sectionId", value)}>
                                    <SelectTrigger id="section">
                                        <SelectValue placeholder="Select section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {sections.map((section) => (
                                            <SelectItem key={section.id} value={section.id}>
                                                {section.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dueDate">
                                    Due Date <span className="text-red-500">*</span>
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn("w-full justify-start text-left font-normal", errors.dueDate && "border-red-500")}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            mode="single"
                                            selected={formData.dueDate}
                                            onSelect={handleDateChange}
                                            initialFocus
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Assignment Status</Label>
                                <RadioGroup value={formData.status} onValueChange={handleStatusChange} className="flex space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="active" id="active" />
                                        <Label htmlFor="active" className="cursor-pointer">
                                            Active
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="inactive" id="inactive" />
                                        <Label htmlFor="inactive" className="cursor-pointer">
                                            Inactive
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="draft" id="draft" />
                                        <Label htmlFor="draft" className="cursor-pointer">
                                            Draft
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attachments */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Attachments</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="attachments">Upload Files</Label>
                            <div className="flex items-center">
                                <Input id="attachments" type="file" multiple onChange={handleFileUpload} className="hidden" />
                                <Label
                                    htmlFor="attachments"
                                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Files
                                </Label>
                            </div>
                        </div>

                        {formData.attachments.length > 0 ? (
                            <div className="space-y-2">
                                {formData.attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50"
                                    >
                                        <div className="flex items-center">
                                            {getFileIcon(attachment.type)}
                                            <span className="ml-2">{attachment.name}</span>
                                            {attachment.isNew && (
                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">New</span>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteAttachment(attachment.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                                <Paperclip className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-gray-500 mb-2">No attachments yet</p>
                                <p className="text-sm text-gray-400">Upload files for students to download (PDF, Word, Excel, etc.)</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Submission Status */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Submission Status</h2>
                    </CardHeader>
                    <CardContent>
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Important</AlertTitle>
                            <AlertDescription>
                                This assignment has {dummyAssignment.submissionCount} submissions out of {dummyAssignment.totalStudents}{" "}
                                students. Editing this assignment will not affect existing submissions.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <Clock className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Discard Changes Dialog */}
            <Dialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Discard Changes</DialogTitle>
                        <DialogDescription>You have unsaved changes. Are you sure you want to discard them?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDiscardDialogOpen(false)}>
                            Continue Editing
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setDiscardDialogOpen(false)
                                navigate(`/assignment/detail/${id}`)
                            }}
                        >
                            Discard Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Attachment Dialog */}
            <Dialog open={!!deleteAttachmentId} onOpenChange={() => setDeleteAttachmentId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Attachment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this attachment? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteAttachmentId(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteAttachment}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
