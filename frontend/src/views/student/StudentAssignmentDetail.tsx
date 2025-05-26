"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format, isPast, formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import {
    ArrowLeft,
    Calendar,
    Download,
    Pencil,
    Trash2,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    File,
    MoreHorizontal,
    Search,
    Filter,
    PenLine,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/ListPage/PageHeader"
import axiosInstance from "@/auth/AxiosInstance.ts";
import {useAuthStore} from "@/store/AuthStore.ts";
// Updated interfaces to match the new API response
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
    submissions: Submission[]
    created_at: string
}

export default function StudentAssignmentDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("details")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [gradingDialogOpen, setGradingDialogOpen] = useState(false)
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
    const [gradeValue, setGradeValue] = useState<string>("")

    const {role} = useAuthStore()
    useEffect(() => {
        fetchAssignmentDetails()
    }, [id])

    const fetchAssignmentDetails = async () => {
        setLoading(true)
        axiosInstance.get(`/api/academic/assignment/${id}/`)
            .then((response) => {
                setAssignment(response.data)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching assignment details:", error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleDeleteAssignment = async () => {
        axiosInstance.delete(`/api/academic/assignment/${id}/`)
            .then(() => {
                navigate("/assignment/list")
                toast.success("Assignment deleted successfully")
            })
            .catch((error) => {
                console.error("Error deleting assignment:", error)
            })
    }

    const handleDuplicateAssignment = async () => {
        try {
            if (assignment) {
                // In a real application, you would call your API
                // const response = await AxiosInstance.post('/api/academic/assignments/duplicate/', { id })

                toast.success("Assignment duplicated successfully")
                // navigate(`/teacher/assignments/${response.data.id}`)
            }
        } catch (error) {
            console.error("Error duplicating assignment:", error)
            toast.error("Failed to duplicate assignment")
        }
    }

    const handleToggleStatus = async () => {
        try {
            if (assignment) {
                const newStatus = assignment.is_active ? "inactive" : "active"

                // In a real application, you would call your API
                // await AxiosInstance.patch(`/api/academic/assignments/${id}/`, { status: newStatus })

                // Update local state
                setAssignment({
                    ...assignment,
                    is_active: newStatus === "active",
                })

                toast.success(`Assignment ${newStatus === "active" ? "activated" : "deactivated"} successfully`)
            }
        } catch (error) {
            console.error("Error updating assignment status:", error)
            toast.error("Failed to update assignment status")
        }
    }

    const handleGradeSubmission = async () => {
        if (!selectedSubmission || !gradeValue) return

        const grade = Number.parseInt(gradeValue)
        if (isNaN(grade) || grade < 0 || grade > (assignment?.subject.full_marks || 100)) {
            toast.error(`Please enter a valid grade between 0 and ${assignment?.subject.full_marks || 100}`)
            return
        }

        axiosInstance.put("/api/academic/assignment-grade/", {
            submission_id: selectedSubmission.id,
            marks: grade,
        })
            .then(() => {
                toast.success("Submission graded successfully")
                setGradingDialogOpen(false)
                setSelectedSubmission(null)
                setGradeValue("")

                setAssignment((prev) => {
                    if (!prev) return prev
                    return {
                        ...prev,
                        submissions: prev.submissions.map((sub) =>
                            sub.id === selectedSubmission.id ? { ...sub, status: "Graded", marks: grade } : sub,
                        ),
                    }
                })
            })
            .catch((error) => {
                console.error("Error grading submission:", error)
                toast.error("Failed to grade submission")
            })
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case "inactive":
                return <AlertCircle className="h-4 w-4 text-amber-500" />
            case "draft":
                return <Clock className="h-4 w-4 text-blue-500" />
            default:
                return null
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

    const getSubmissionStatusBadge = (status: string) => {
        switch (status) {
            case "Graded":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        Graded
                    </Badge>
                )
            case "Not Graded":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                        Not Graded
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
                        {status}
                    </Badge>
                )
        }
    }

    const filteredSubmissions =
        assignment?.submissions.filter((submission) => {
            const matchesSearch = submission.student.full_name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === "all" || submission.status === statusFilter
            return matchesSearch && matchesStatus
        }) || []

    // const submittedCount = submissions.filter((s) => s.status === "submitted" || s.status === "late").length
    // const gradedCount = submissions.filter((s) => s.status === "graded").length
    // const lateCount = submissions.filter((s) => s.status === "late").length
    // const notSubmittedCount = submissions.filter((s) => s.status === "not_submitted").length

    if (loading) {
        return (
            <div className="p-4 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/teacher/assignments")}>
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
                    <Button variant="ghost" size="icon" onClick={() => navigate("/teacher/assignments")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Assignment not found</h1>
                </div>
                <p>The assignment you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => navigate("/teacher/assignments")}>Back to Assignments</Button>
            </div>
        )
    }

    const isPastDue = isPast(new Date(assignment.due_date))
    const isActive = assignment.is_active

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
                        isPastDue && isActive
                            ? "bg-red-50 text-red-700 hover:bg-red-50"
                            : "bg-green-50 text-green-700 hover:bg-green-50",
                    )}
                >
                    Due: {format(new Date(assignment.due_date), "MMM d, yyyy")}
                    {isPastDue && isActive && (
                        <span className="ml-1">(Overdue by {formatDistanceToNow(new Date(assignment.due_date))})</span>
                    )}
                </Badge>
            </div>

            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    {/*<TabsTrigger value="submissions">*/}
                    {/*    Submissions ({assignment.total_submissions}/{assignment.total_students})*/}
                    {/*</TabsTrigger>*/}
                </TabsList>

                <TabsContent value="details" className="mt-0">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Assignment Description</h2>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none">
                                <p className="whitespace-pre-line">{assignment.description}</p>
                            </div>


                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center border-t pt-4">
                            <div className="text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => navigate(`/assignment/edit/${id}`)}>
                                    <Pencil className="h-4 w-4 mr-2"/>
                                    Submit Assignment
                                </Button>
                            </div>
                            {
                                role == "teacher" ? (
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" onClick={() => navigate(`/assignment/edit/${id}`)}>
                                            <Pencil className="h-4 w-4 mr-2"/>
                                            Edit Assignment
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="icon">
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem
                                                    onClick={() => setDeleteDialogOpen(true)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2"/>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ) : null
                            }
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/*<TabsContent value="submissions" className="mt-0">*/}
                {/*    <Card>*/}
                {/*        <CardHeader>*/}
                {/*            <div className="flex justify-between items-center">*/}
                {/*                <h2 className="text-xl font-semibold">Student Submissions</h2>*/}
                {/*                <div className="text-sm text-muted-foreground">*/}
                {/*                    {assignment.total_submissions} of {assignment.total_students} students have*/}
                {/*                                                   submitted*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </CardHeader>*/}
                {/*        <CardContent>*/}
                {/*            /!* Search and Filters *!/*/}
                {/*            <div*/}
                {/*                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">*/}
                {/*                <div className="relative w-full sm:w-[300px]">*/}
                {/*                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>*/}
                {/*                    <Input*/}
                {/*                        type="search"*/}
                {/*                        placeholder="Search students..."*/}
                {/*                        value={searchQuery}*/}
                {/*                        onChange={(e) => setSearchQuery(e.target.value)}*/}
                {/*                        className="w-full pl-8"*/}
                {/*                    />*/}
                {/*                </div>*/}

                {/*                <div className="flex items-center gap-2">*/}
                {/*                    <Select value={statusFilter} onValueChange={setStatusFilter}>*/}
                {/*                        <SelectTrigger className="w-[180px]">*/}
                {/*                            <SelectValue placeholder="Filter by status" />*/}
                {/*                        </SelectTrigger>*/}
                {/*                        <SelectContent>*/}
                {/*                            <SelectItem value="all">All Submissions</SelectItem>*/}
                {/*                            <SelectItem value="Not Graded">Not Graded</SelectItem>*/}
                {/*                            <SelectItem value="Graded">Graded</SelectItem>*/}
                {/*                        </SelectContent>*/}
                {/*                    </Select>*/}

                {/*                    <Button variant="outline" size="icon" className="h-10 w-10">*/}
                {/*                        <Filter className="h-4 w-4" />*/}
                {/*                    </Button>*/}
                {/*                </div>*/}
                {/*            </div>*/}

                {/*            {filteredSubmissions.length > 0 ? (*/}
                {/*                <div className="rounded-md border">*/}
                {/*                    <Table>*/}
                {/*                        <TableHeader>*/}
                {/*                            <TableRow>*/}
                {/*                                <TableHead>Student</TableHead>*/}
                {/*                                <TableHead>Status</TableHead>*/}
                {/*                                <TableHead>Submitted</TableHead>*/}
                {/*                                <TableHead>Grade</TableHead>*/}
                {/*                                <TableHead>Files</TableHead>*/}
                {/*                                <TableHead className="text-right">Actions</TableHead>*/}
                {/*                            </TableRow>*/}
                {/*                        </TableHeader>*/}
                {/*                        <TableBody>*/}
                {/*                            {filteredSubmissions.map((submission) => (*/}
                {/*                                <TableRow key={submission.id}>*/}
                {/*                                    <TableCell className="font-medium">{submission.student.full_name}</TableCell>*/}
                {/*                                    <TableCell>{getSubmissionStatusBadge(submission.status)}</TableCell>*/}
                {/*                                    <TableCell>*/}
                {/*                                        {submission.submission_date ? (*/}
                {/*                                            <>*/}
                {/*                                                {format(new Date(submission.submission_date), "MMM d, yyyy")}*/}
                {/*                                                <div className="text-xs text-muted-foreground">*/}
                {/*                                                    {format(new Date(submission.submission_date), "h:mm a")}*/}
                {/*                                                </div>*/}
                {/*                                            </>*/}
                {/*                                        ) : (*/}
                {/*                                            <span className="text-muted-foreground">-</span>*/}
                {/*                                        )}*/}
                {/*                                    </TableCell>*/}
                {/*                                    <TableCell>*/}
                {/*                                        {submission.marks !== undefined ? (*/}
                {/*                                            <span className="font-medium">*/}
                {/*                {submission.marks}/{assignment?.subject.full_marks}*/}
                {/*              </span>*/}
                {/*                                        ) : (*/}
                {/*                                            <span className="text-muted-foreground">Not graded</span>*/}
                {/*                                        )}*/}
                {/*                                    </TableCell>*/}
                {/*                                    <TableCell>*/}
                {/*                                        {submission.file ? (*/}
                {/*                                            <div className="flex items-center text-xs text-blue-600 hover:underline">*/}
                {/*                                                <FileText className="w-4 h-4 mr-1" />*/}
                {/*                                                <span className="truncate max-w-[150px]">{submission.file.split("/").pop()}</span>*/}
                {/*                                            </div>*/}
                {/*                                        ) : (*/}
                {/*                                            <span className="text-muted-foreground">No file</span>*/}
                {/*                                        )}*/}
                {/*                                    </TableCell>*/}
                {/*                                    <TableCell className="text-right">*/}
                {/*                                        <div className="flex justify-end gap-2">*/}
                {/*                                            {submission.file && (*/}
                {/*                                                <Button variant="ghost" size="sm" asChild>*/}
                {/*                                                    <a href={submission.file} download target="_blank" rel="noopener noreferrer">*/}
                {/*                                                        <Download className="h-4 w-4 mr-1" />*/}
                {/*                                                        Download*/}
                {/*                                                    </a>*/}
                {/*                                                </Button>*/}
                {/*                                            )}*/}
                {/*                                            {*/}
                {/*                                                role == "teacher" ? (*/}
                {/*                                                    <Button*/}
                {/*                                                        variant="outline"*/}
                {/*                                                        size="sm"*/}
                {/*                                                        disabled={submission.status === "Graded"}*/}
                {/*                                                        onClick={() => {*/}
                {/*                                                            if (submission.status !== "Graded") {*/}
                {/*                                                                setSelectedSubmission(submission)*/}
                {/*                                                                setGradingDialogOpen(true)*/}
                {/*                                                            }*/}
                {/*                                                        }}*/}
                {/*                                                    >*/}
                {/*                                                        <PenLine className="h-4 w-4 mr-1" />*/}
                {/*                                                        Grade Assignment*/}
                {/*                                                    </Button>*/}
                {/*                                                ) : null*/}
                {/*                                            }*/}
                {/*                                        </div>*/}
                {/*                                    </TableCell>*/}
                {/*                                </TableRow>*/}
                {/*                            ))}*/}
                {/*                        </TableBody>*/}
                {/*                    </Table>*/}
                {/*                </div>*/}
                {/*            ) : (*/}
                {/*                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 min-h-[200px]">*/}
                {/*                    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>*/}
                {/*                    <p className="text-gray-500 mb-4 text-center">*/}
                {/*                        No submissions match your current filters. Try adjusting your search or filter criteria.*/}
                {/*                    </p>*/}
                {/*                </div>*/}
                {/*            )}*/}
                {/*        </CardContent>*/}
                {/*        <CardFooter className="flex justify-between border-t pt-4">*/}
                {/*            <div className="text-sm text-muted-foreground">*/}
                {/*                Last updated: {format(new Date(), "MMM d, yyyy h:mm a")}*/}
                {/*            </div>*/}
                {/*        </CardFooter>*/}
                {/*    </Card>*/}
                {/*</TabsContent>*/}
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this assignment? This action cannot be undone and will remove all student
                            submissions.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAssignment}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Grading Dialog */}
            <Dialog open={gradingDialogOpen} onOpenChange={setGradingDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Grade Assignment</DialogTitle>
                        <DialogDescription>
                            Enter the marks obtained by {selectedSubmission?.student.full_name} out of{" "}
                            {assignment?.subject.full_marks}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder={`Enter marks (0-${assignment?.subject.full_marks})`}
                                value={gradeValue}
                                onChange={(e) => setGradeValue(e.target.value)}
                                min="0"
                                max={assignment?.subject.full_marks}
                                className="flex-1"
                            />
                            <span className="text-sm text-muted-foreground">/{assignment?.subject.full_marks}</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setGradingDialogOpen(false)
                                setSelectedSubmission(null)
                                setGradeValue("")
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleGradeSubmission}>Submit Grade</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
