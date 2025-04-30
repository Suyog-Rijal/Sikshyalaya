"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { FileText, Search, Calendar, Clock, Upload, CheckCircle, X, Download, Eye } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {useAuthStore} from "@/store/AuthStore.ts";

interface Assignment {
    id: string
    title: string
    subject: string
    description: string
    dueDate: string
    assignedDate: string
    status: "Pending" | "Submitted" | "Graded"
    grade?: string
    feedback?: string
    attachments?: {
        name: string
        url: string
    }[]
}

export function StudentAssignment() {
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("")
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return format(date, "MMMM dd, yyyy")
    }

    const {role} = useAuthStore()

    useEffect(() => {
        // Simulate API call to fetch assignments
        setTimeout(() => {
            const mockAssignments: Assignment[] = [
                {
                    id: "1",
                    title: "Test assignment",
                    subject: "English",
                    description:
                        "Test assignment description",
                    dueDate: "2024-06-01",
                    assignedDate: "2024-06-01",
                    status: "Pending",
                    attachments: [
                        {
                            name: "All Tables Structure.pdf",
                            url: "/files/chapter5_problems.pdf",
                        },
                    ],
                },
            ]

            setAssignments(mockAssignments)
            setLoading(false)
        }, 1500)
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files))
        }
    }

    const handleSubmit = () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select files to upload")
            return
        }

        setUploading(true)
        setUploadProgress(0)

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 5
            })
        }, 100)

        // Simulate upload completion
        setTimeout(() => {
            clearInterval(interval)
            setUploadProgress(100)

            // Update assignment status
            if (selectedAssignment) {
                setAssignments((prev) =>
                    prev.map((assignment) =>
                        assignment.id === selectedAssignment.id ? { ...assignment, status: "Submitted" } : assignment,
                    ),
                )
            }

            setUploading(false)
            setSelectedFiles([])
            setSubmitDialogOpen(false)
            toast.success("Assignment submitted successfully")
        }, 2000)
    }

    const removeSelectedFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const openSubmitDialog = (assignment: Assignment) => {
        setSelectedAssignment(assignment)
        setSubmitDialogOpen(true)
    }

    const openViewDialog = (assignment: Assignment) => {
        setSelectedAssignment(assignment)
        setViewDialogOpen(true)
    }

    // Filter assignments based on search text
    const filteredAssignments = assignments.filter(
        (assignment) =>
            assignment.title.toLowerCase().includes(searchText.toLowerCase()) ||
            assignment.subject.toLowerCase().includes(searchText.toLowerCase()),
    )

    // Count assignments by status
    const pendingCount = assignments.filter((a) => a.status === "Pending").length
    const submittedCount = assignments.filter((a) => a.status === "Submitted").length
    const gradedCount = assignments.filter((a) => a.status === "Graded").length

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Pending":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Pending
                    </Badge>
                )
            case "Submitted":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Submitted
                    </Badge>
                )
            case "Graded":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Graded
                    </Badge>
                )
            default:
                return null
        }
    }

    return (
        <div className="p-6 bg-gray-50">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Assignments</h1>
                <p className="text-gray-500">View and submit your assignments</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-amber-50 p-3 rounded-full">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Pending</h3>
                                <p className="text-sm text-gray-500 mt-1">{pendingCount} assignments due</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-full">
                                <Upload className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Submitted</h3>
                                <p className="text-sm text-gray-500 mt-1">{submittedCount} assignments submitted</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-green-50 p-3 rounded-full">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Graded</h3>
                                <p className="text-sm text-gray-500 mt-1">{gradedCount} assignments graded</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                        placeholder="Search assignments..."
                        className="pl-10"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>

            {/* Assignments Table */}
            <Card className="bg-white border border-gray-200">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Assignment</TableHead>
                                <TableHead className="hidden md:table-cell">Subject</TableHead>
                                <TableHead className="hidden lg:table-cell">Assigned Date</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                {
                                    role == 'admin' ? (
                                        <TableHead className="text-right">Actions</TableHead>
                                    ): null
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton className="h-5 w-40" />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Skeleton className="h-5 w-24" />
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <Skeleton className="h-5 w-28" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-28" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-20" />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Skeleton className="h-9 w-20 ml-auto" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : filteredAssignments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        No assignments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAssignments.map((assignment) => (
                                    <TableRow key={assignment.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">{assignment.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{assignment.subject}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                                <span>{formatDate(assignment.assignedDate)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-gray-500" />
                                                <span>{formatDate(assignment.dueDate)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                                        {
                                            role == 'admin' ? (
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => openViewDialog(assignment)}>
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                        </Button>
                                                        {assignment.status === "Pending" && (
                                                            <Button variant="default" size="sm" onClick={() => openSubmitDialog(assignment)}>
                                                                <Upload className="h-4 w-4 mr-1" />
                                                                Submit
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            ): null
                                        }
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Submit Assignment Dialog */}
            <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Submit Assignment</DialogTitle>
                        <DialogDescription>
                            {selectedAssignment?.title} - {selectedAssignment?.subject}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium">Click to browse or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">Upload your assignment files</p>
                        </div>

                        {selectedFiles.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</p>
                                <div className="max-h-40 overflow-y-auto space-y-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="h-4 w-4 text-gray-500" />
                                                <div className="truncate max-w-[200px]">
                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeSelectedFile(index)
                                                }}
                                                className="text-gray-500 hover:text-red-500"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {uploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <Progress value={uploadProgress} className="h-2" />
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSubmitDialogOpen(false)} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={selectedFiles.length === 0 || uploading}>
                            {uploading ? "Uploading..." : "Submit Assignment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Assignment Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedAssignment?.title}</DialogTitle>
                        <DialogDescription>
                            {selectedAssignment?.subject} - Due: {selectedAssignment && formatDate(selectedAssignment.dueDate)}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium mb-2">Description</h3>
                            <p className="text-sm text-gray-700">{selectedAssignment?.description}</p>
                        </div>

                        {selectedAssignment?.attachments && selectedAssignment.attachments.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium mb-2">Attachments</h3>
                                <div className="space-y-2">
                                    {selectedAssignment.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm">{attachment.name}</span>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-1" />
                                                Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedAssignment?.status === "Graded" && (
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium">Feedback</h3>
                                    <Badge className="bg-green-100 text-green-700 border-0">Grade: {selectedAssignment.grade}</Badge>
                                </div>
                                <p className="text-sm text-gray-700">{selectedAssignment.feedback}</p>
                            </div>
                        )}

                        {selectedAssignment?.status === "Pending" && (
                            <div className="flex justify-center">
                                <Button
                                    onClick={() => {
                                        setViewDialogOpen(false)
                                        openSubmitDialog(selectedAssignment)
                                    }}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Submit Now
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
