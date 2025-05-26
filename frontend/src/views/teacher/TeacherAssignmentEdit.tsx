"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, Paperclip, Trash2, Upload, Save, Clock, FileText, Image } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { PageHeader } from "@/components/ListPage/PageHeader"
import axiosInstance from "@/auth/AxiosInstance.ts"

interface Student {
    id: string
    full_name: string
}

interface Submission {
    id: string
    student: Student
    submission_date: string
    file: string
    status: string
    marks: string
}

interface Subject {
    id: string
    name: string
    full_marks: number
    pass_marks: number
}

interface SchoolClass {
    id: string
    name: string
}

interface Section {
    name: string | null
}

interface Attachment {
    id: string
    file: string
}

interface Assignment {
    id: string
    title: string
    description: string
    due_date: string
    subject: Subject
    school_class: SchoolClass
    section: Section
    attachments: Attachment[]
    is_active: boolean
    total_students: number
    total_submissions: number
    submissions: Submission[]
    created_at: string
}

interface FormData {
    title: string
    description: string
    status: string
    attachments: { id: string; name: string; type: string; isNew: boolean; file?: File; markedForDeletion?: boolean }[]
}

export default function TeacherAssignmentEdit() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
    const [deleteAttachmentId, setDeleteAttachmentId] = useState<string | null>(null)
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        status: "inactive",
        attachments: []
    })

    useEffect(() => {
        fetchAssignmentDetails()
    }, [id])

    const getFileTypeFromUrl = (url: string) => {
        const extension = url.split(".").pop()?.toLowerCase()
        switch (extension) {
            case "pdf":
                return "application/pdf"
            case "jpg":
            case "jpeg":
                return "image/jpeg"
            case "png":
                return "image/png"
            case "doc":
            case "docx":
                return "application/msword"
            default:
                return "application/octet-stream"
        }
    }

    const fetchAssignmentDetails = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get(`/api/academic/assignment/${id}/`)
            const assignmentData = res.data
            setAssignment(assignmentData)
            setFormData({
                title: assignmentData.title,
                description: assignmentData.description,
                status: assignmentData.is_active ? "active" : "inactive",
                attachments: Array.isArray(assignmentData.attachments)
                    ? assignmentData.attachments.map((attachment: Attachment) => ({
                        id: attachment.id,
                        name: attachment.file.split("/").pop() || "Unknown File",
                        type: getFileTypeFromUrl(attachment.file),
                        isNew: false
                    }))
                    : []
            })
        } catch (error) {
            console.error("Error fetching assignment details:", error)
            toast.error("Failed to load assignment details")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({ ...prev, status: value }))
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const newAttachment = {
                id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                name: file.name,
                type: file.type,
                isNew: true,
                file
            }
            setFormData((prev) => ({
                ...prev,
                attachments: [
                    ...prev.attachments.filter((att) => !att.isNew), // Keep existing attachments
                    newAttachment
                ]
            }))
        }
    }

    const handleDeleteAttachment = (attachmentId: string) => {
        setDeleteAttachmentId(attachmentId)
    }

    const confirmDeleteAttachment = () => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.map((attachment) =>
                attachment.id === deleteAttachmentId
                    ? { ...attachment, markedForDeletion: true }
                    : attachment
            ).filter((attachment) => !attachment.markedForDeletion || (attachment.isNew && !attachment.markedForDeletion))
        }))
        setDeleteAttachmentId(null)
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (!formData.description.trim()) newErrors.description = "Description is required"
        return newErrors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setSaving(true)
        try {
            const formDataToSend = new FormData()
            formDataToSend.append("title", formData.title)
            formDataToSend.append("description", formData.description)
            formDataToSend.append("is_active", formData.status === "active" ? "true" : "false")

            const attachmentsToDelete = formData.attachments
                .filter((attachment) => attachment.markedForDeletion && !attachment.isNew)
                .map((attachment) => attachment.id)
            formDataToSend.append("delete_attachments", JSON.stringify(attachmentsToDelete))

            const newAttachment = formData.attachments.find((attachment) => attachment.isNew && !attachment.markedForDeletion)
            if (newAttachment?.file) {
                formDataToSend.append("file", newAttachment.file)
            }

            await axiosInstance.put(`/api/academic/assignment/${id}/`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            toast.success("Assignment updated successfully")
            navigate(`/assignment/detail/${id}`)
        } catch (error) {
            console.error("Error updating assignment:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setDiscardDialogOpen(true)
    }

    const getFileIcon = (type: string) => {
        if (type.includes("pdf")) return <FileText className="h-4 w-4" />
        if (type.includes("image")) return <Image className="h-4 w-4" />
        if (type.includes("msword")) return <FileText className="h-4 w-4" />
        return <Paperclip className="h-4 w-4" />
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
                    { label: "edit", href: `/assignment/edit/${id}` }
                ]}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
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
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Attachment</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="attachment">Upload File</Label>
                            <div className="flex items-center">
                                <Input id="attachment" type="file" onChange={handleFileUpload} className="hidden" />
                                <Label
                                    htmlFor="attachment"
                                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload File
                                </Label>
                            </div>
                        </div>

                        {formData.attachments.length > 0 ? (
                            <div className="space-y-2">
                                {formData.attachments.map((attachment) => (
                                    !attachment.markedForDeletion && (
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
                                    )
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                                <Paperclip className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-gray-500 mb-2">No attachment yet</p>
                                <p className="text-sm text-gray-400">Upload a file for students to download (PDF, Word, Excel, etc.)</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

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