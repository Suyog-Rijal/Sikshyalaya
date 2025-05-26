"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format, isPast, formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import {
    ArrowLeft,
    Calendar,
    Download,
    Upload,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    File,
    X,
    CloudUpload,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/ListPage/PageHeader"
import axiosInstance from "@/auth/AxiosInstance.ts"
import { useAuthStore } from "@/store/AuthStore.ts"

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

interface StudentSubmission {
    id: string
    submission_date: string
    file: string
    status: string
    marks: number | null
}

interface Assignment {
    id: string
    title: string
    description: string
    due_date: string
    subject: Subject
    school_class: SchoolClass
    section: Section
    is_active: boolean
    total_students: number
    total_submissions: number
    created_at: string
    student_submission?: StudentSubmission
}

export default function SubmissionPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false)

    useEffect(() => {
        fetchAssignmentDetails()
    }, [id])

    const fetchAssignmentDetails = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(`/api/academic/assignment/${id}/`)
            setAssignment(response.data)
        } catch (error) {
            console.error("Error fetching assignment details:", error)
            toast.error("Failed to load assignment details")
        } finally {
            setLoading(false)
        }
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Check file size (e.g., max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB")
                return
            }
            setSelectedFile(file)
        }
    }

    const handleSubmitAssignment = async () => {
        if (!selectedFile) {
            toast.error("Please select a file to submit")
            return
        }

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("assignment", id!)
            formData.append("file", selectedFile)

            await axiosInstance.post("/api/academic/submission/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            toast.success("Assignment submitted successfully!")
            setSubmitDialogOpen(false)
            setSelectedFile(null)
            fetchAssignmentDetails() // Refresh to show updated submission
        } catch (error) {
            console.error("Error submitting assignment:", error)
            toast.error("Failed to submit assignment")
        } finally {
            setUploading(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Graded":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case "Not Graded":
                return <Clock className="h-4 w-4 text-amber-500" />
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />
        }
    }

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split(".").pop()?.toLowerCase()
        switch (extension) {
            case "pdf":
                return <FileText className="h-4 w-4 text-red-500" />
            case "doc":
            case "docx":
                return <FileText className="h-4 w-4 text-blue-500" />
            case "xls":
            case "xlsx":
                return <FileText className="h-4 w-4 text-green-500" />
            case "ppt":
            case "pptx":
                return <FileText className="h-4 w-4 text-orange-500" />
            default:
                return <File className="h-4 w-4 text-gray-500" />
        }
    }

    const getSubmissionStatusBadge = (status: string) => {
        switch (status) {
            case "Graded":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Graded
                    </Badge>
                )
            case "Not Graded":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                        <Clock className="h-3 w-3 mr-1" />
                        Submitted - Pending Review
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
                        Not Submitted
                    </Badge>
                )
        }
    }

    if (loading) {
        return (
            <div className="p-4 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/student/assignments")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Loading assignment details...</h1>
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

    if (!assignment) {
        return (
            <div className="p-4 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/student/assignments")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Assignment not found</h1>
                </div>
                <p>The assignment you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => navigate("/student/assignments")}>Back to Assignments</Button>
            </div>
        )
    }

    const isPastDue = isPast(new Date(assignment.due_date))
    const hasSubmitted = assignment.student_submission
    const canSubmit = assignment.is_active && (!hasSubmitted || hasSubmitted.status === "Not Graded")

    return (
        <div className="p-4 flex flex-col gap-6">
            <PageHeader
                title="Assignment Details"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Assignments", href: "/assignment/list" },
                    { label: "Details", href: `/assignment/detail/${id}` },
                ]}
            />

            <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{assignment.title}</h1>
                <div className="flex items-center ml-2">
                    {getStatusIcon(assignment.is_active ? "active" : "inactive")}
                    <span className="ml-1 text-sm text-muted-foreground capitalize">
            {assignment.is_active ? "active" : "inactive"}
          </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                    {assignment.subject.name}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                    {assignment.school_class.name} {assignment.section?.name}
                </Badge>
                <Badge
                    variant="outline"
                    className={cn(
                        isPastDue && assignment.is_active
                            ? "bg-red-50 text-red-700 hover:bg-red-50"
                            : "bg-green-50 text-green-700 hover:bg-green-50",
                    )}
                >
                    <Calendar className="h-3 w-3 mr-1" />
                    Due: {format(new Date(assignment.due_date), "MMM d, yyyy")}
                    {isPastDue && assignment.is_active && (
                        <span className="ml-1">(Overdue by {formatDistanceToNow(new Date(assignment.due_date))})</span>
                    )}
                </Badge>
                <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
                    Max Marks: {assignment.subject.full_marks}
                </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Assignment Details */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Assignment Description</h2>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none">
                                <p className="whitespace-pre-line text-gray-700">{assignment.description}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                            <div className="text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Created: {format(new Date(assignment.created_at), "MMM d, yyyy")}
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Submission Panel */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Your Submission</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {hasSubmitted ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Status:</span>
                                        {getSubmissionStatusBadge(hasSubmitted.status)}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Submitted:</span>
                                        <span className="text-sm text-muted-foreground">
                      {format(new Date(hasSubmitted.submission_date), "MMM d, yyyy h:mm a")}
                    </span>
                                    </div>

                                    {hasSubmitted.marks !== null && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Grade:</span>
                                            <span className="text-sm font-semibold text-green-600">
                        {hasSubmitted.marks}/{assignment.subject.full_marks}
                      </span>
                                        </div>
                                    )}

                                    {hasSubmitted.file && (
                                        <div className="border rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    {getFileIcon(hasSubmitted.file)}
                                                    <span className="ml-2 text-sm truncate">{hasSubmitted.file.split("/").pop()}</span>
                                                </div>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={hasSubmitted.file} download target="_blank" rel="noopener noreferrer">
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {canSubmit && (
                                        <Button onClick={() => setSubmitDialogOpen(true)} className="w-full" variant="outline">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Resubmit Assignment
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                                        <CloudUpload className="h-12 w-12 text-gray-400 mb-2" />
                                        <p className="text-sm text-muted-foreground mb-2">No submission yet</p>
                                        {canSubmit ? (
                                            <Button onClick={() => setSubmitDialogOpen(true)}>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Submit Assignment
                                            </Button>
                                        ) : (
                                            <p className="text-xs text-red-500">
                                                {isPastDue ? "Assignment is overdue" : "Assignment is not active"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Submit Assignment Dialog */}
            <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Assignment</DialogTitle>
                        <DialogDescription>
                            Upload your assignment file. Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max 10MB)
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="file-upload">Select File</Label>
                            <Input
                                id="file-upload"
                                type="file"
                                onChange={handleFileSelect}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                className="cursor-pointer"
                            />
                        </div>

                        {selectedFile && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    {getFileIcon(selectedFile.name)}
                                    <div className="ml-2">
                                        <p className="text-sm font-medium">{selectedFile.name}</p>
                                        <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSubmitDialogOpen(false)
                                setSelectedFile(null)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitAssignment} disabled={!selectedFile || uploading}>
                            {uploading ? "Uploading..." : "Submit Assignment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
