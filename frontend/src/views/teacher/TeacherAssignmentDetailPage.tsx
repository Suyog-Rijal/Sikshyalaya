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
    Copy,
    Trash2,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    File,
    MoreHorizontal,
    ToggleLeft,
    ToggleRight,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PageHeader } from "@/components/ListPage/PageHeader"
import {Assignment} from "@/views/teacher/TeacherAssignmentList.tsx";

// Student submission interface
interface StudentSubmission {
    id: string
    studentId: string
    studentName: string
    submittedAt: string
    status: "submitted" | "late" | "graded" | "not_submitted"
    grade?: number
    feedback?: string
    files: {
        id: string
        name: string
        type: string
        url: string
        size: string
    }[]
}

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

// Dummy data for student submissions
const dummySubmissions: StudentSubmission[] = [
    {
        id: "sub-1",
        studentId: "std-101",
        studentName: "Alex Johnson",
        submittedAt: "2025-05-08T14:30:00Z",
        status: "graded",
        grade: 92,
        feedback: "Excellent work! Your solutions were well-explained.",
        files: [
            {
                id: "file-1",
                name: "alex_johnson_algebra.pdf",
                type: "application/pdf",
                url: "#",
                size: "2.4 MB",
            },
        ],
    },
    {
        id: "sub-2",
        studentId: "std-102",
        studentName: "Maria Garcia",
        submittedAt: "2025-05-09T09:15:00Z",
        status: "graded",
        grade: 88,
        feedback: "Good work, but check your work on problem 15.",
        files: [
            {
                id: "file-2",
                name: "maria_garcia_math_hw.pdf",
                type: "application/pdf",
                url: "#",
                size: "1.8 MB",
            },
        ],
    },
    {
        id: "sub-3",
        studentId: "std-103",
        studentName: "James Wilson",
        submittedAt: "2025-05-10T22:45:00Z",
        status: "submitted",
        files: [
            {
                id: "file-3",
                name: "james_wilson_assignment.pdf",
                type: "application/pdf",
                url: "#",
                size: "3.1 MB",
            },
            {
                id: "file-4",
                name: "additional_notes.docx",
                type: "application/msword",
                url: "#",
                size: "520 KB",
            },
        ],
    },
    {
        id: "sub-4",
        studentId: "std-104",
        studentName: "Sophia Chen",
        submittedAt: "2025-05-11T01:20:00Z",
        status: "late",
        files: [
            {
                id: "file-5",
                name: "sophia_chen_math.pdf",
                type: "application/pdf",
                url: "#",
                size: "2.2 MB",
            },
        ],
    },
    {
        id: "sub-5",
        studentId: "std-105",
        studentName: "Mohammed Al-Farsi",
        submittedAt: "2025-05-09T16:40:00Z",
        status: "graded",
        grade: 95,
        feedback: "Outstanding work! Your approach to problem 18 was particularly creative.",
        files: [
            {
                id: "file-6",
                name: "mohammed_alfarsi_algebra_solutions.pdf",
                type: "application/pdf",
                url: "#",
                size: "2.7 MB",
            },
        ],
    },
    {
        id: "sub-6",
        studentId: "std-106",
        studentName: "Emma Thompson",
        submittedAt: "2025-05-10T19:55:00Z",
        status: "submitted",
        files: [
            {
                id: "file-7",
                name: "emma_thompson_homework.pdf",
                type: "application/pdf",
                url: "#",
                size: "1.9 MB",
            },
        ],
    },
    {
        id: "sub-7",
        studentId: "std-107",
        studentName: "Daniel Kim",
        submittedAt: "2025-05-07T11:30:00Z",
        status: "graded",
        grade: 90,
        feedback: "Very good work. Your explanations were clear and concise.",
        files: [
            {
                id: "file-8",
                name: "daniel_kim_math_assignment.pdf",
                type: "application/pdf",
                url: "#",
                size: "2.1 MB",
            },
        ],
    },
    {
        id: "sub-8",
        studentId: "std-108",
        studentName: "Olivia Martinez",
        status: "not_submitted",
        submittedAt: "",
        files: [],
    },
    {
        id: "sub-9",
        studentId: "std-109",
        studentName: "William Taylor",
        status: "not_submitted",
        submittedAt: "",
        files: [],
    },
]

export default function TeacherAssignmentDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [submissions, setSubmissions] = useState<StudentSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("details")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [gradingDialogOpen, setGradingDialogOpen] = useState(false)
    const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null)
    const [gradeValue, setGradeValue] = useState<string>("")

    useEffect(() => {
        fetchAssignmentDetails()
    }, [id])

    const fetchAssignmentDetails = async () => {
        setLoading(true)
        try {
            // In a real application, you would fetch from your API
            // const response = await AxiosInstance.get(`/api/academic/assignments/${id}/`)
            // setAssignment(response.data)

            // Using dummy data for now
            setTimeout(() => {
                setAssignment(dummyAssignment)
                setSubmissions(dummySubmissions)
                setLoading(false)
            }, 800)
        } catch (error) {
            console.error("Error fetching assignment details:", error)
            toast.error("Failed to load assignment details. Please try again.")
            setLoading(false)
        }
    }

    const handleDeleteAssignment = async () => {
        try {
            // In a real application, you would call your API
            // await AxiosInstance.delete(`/api/academic/assignments/${id}/`)

            toast.success("Assignment deleted successfully")
            navigate("/teacher/assignments")
        } catch (error) {
            console.error("Error deleting assignment:", error)
            toast.error("Failed to delete assignment")
        }
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
                const newStatus = assignment.status === "active" ? "inactive" : "active"

                // In a real application, you would call your API
                // await AxiosInstance.patch(`/api/academic/assignments/${id}/`, { status: newStatus })

                // Update local state
                setAssignment({
                    ...assignment,
                    status: newStatus as "active" | "inactive" | "draft",
                })

                toast.success(`Assignment ${newStatus === "active" ? "activated" : "deactivated"} successfully`)
            }
        } catch (error) {
            console.error("Error updating assignment status:", error)
            toast.error("Failed to update assignment status")
        }
    }

    const handleGradeSubmission = () => {
        if (!selectedSubmission || !gradeValue) return

        const grade = Number.parseInt(gradeValue)
        if (isNaN(grade) || grade < 0 || grade > 100) {
            toast.error("Please enter a valid grade between 0 and 100")
            return
        }

        // In a real application, you would call your API
        // await AxiosInstance.post(`/api/academic/assignments/${id}/submissions/${selectedSubmission.id}/grade`, { grade })

        // Update local state
        setSubmissions(
            submissions.map((sub) => (sub.id === selectedSubmission.id ? { ...sub, status: "graded", grade } : sub)),
        )

        toast.success(`Submission graded successfully`)
        setGradingDialogOpen(false)
        setSelectedSubmission(null)
        setGradeValue("")
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
            case "submitted":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        Submitted
                    </Badge>
                )
            case "late":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                        Late
                    </Badge>
                )
            case "graded":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        Graded
                    </Badge>
                )
            case "not_submitted":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                        Not Submitted
                    </Badge>
                )
            default:
                return null
        }
    }

    // Filter submissions based on search query and status filter
    const filteredSubmissions = submissions.filter((submission) => {
        const matchesSearch = submission.studentName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || submission.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // const submittedCount = submissions.filter((s) => s.status === "submitted" || s.status === "late").length
    // const gradedCount = submissions.filter((s) => s.status === "graded").length
    // const lateCount = submissions.filter((s) => s.status === "late").length
    const notSubmittedCount = submissions.filter((s) => s.status === "not_submitted").length

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

    const isPastDue = isPast(new Date(assignment.dueDate))
    const isActive = assignment.status === "active"

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
                    {getStatusIcon(assignment.status)}
                    <span className="ml-1 text-sm text-muted-foreground capitalize">{assignment.status}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                    {assignment.subject.name}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                    {assignment.class.name} {assignment.section?.name}
                </Badge>
                <Badge
                    variant="outline"
                    className={cn(
                        isPastDue && isActive
                            ? "bg-red-50 text-red-700 hover:bg-red-50"
                            : "bg-green-50 text-green-700 hover:bg-green-50",
                    )}
                >
                    Due: {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                    {isPastDue && isActive && (
                        <span className="ml-1">(Overdue by {formatDistanceToNow(new Date(assignment.dueDate))})</span>
                    )}
                </Badge>
            </div>

            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="submissions">
                        Submissions ({submissions.length - notSubmittedCount}/{assignment.totalStudents})
                    </TabsTrigger>
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

                            {assignment.attachments.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium mb-2">Attachments</h3>
                                    <div className="grid gap-2">
                                        {assignment.attachments.map((attachment) => (
                                            <div key={attachment.id} className="flex items-center p-3 border rounded-md hover:bg-muted/50">
                                                {getFileIcon(attachment.type)}
                                                <span className="ml-2 flex-grow">{attachment.name}</span>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={attachment.url} download target="_blank" rel="noopener noreferrer">
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Download
                                                    </a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center border-t pt-4">
                            <div className="text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Created: {format(new Date(assignment.createdAt), "MMM d, yyyy")}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => navigate(`/assignment/edit/${id}`)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Assignment
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={handleDuplicateAssignment}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleToggleStatus}>
                                            {isActive ? (
                                                <>
                                                    <ToggleLeft className="h-4 w-4 mr-2" />
                                                    Deactivate
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleRight className="h-4 w-4 mr-2" />
                                                    Activate
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => setDeleteDialogOpen(true)}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="submissions" className="mt-0">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Student Submissions</h2>
                                <div className="text-sm text-muted-foreground">
                                    {submissions.length - notSubmittedCount} of {assignment.totalStudents} students have submitted
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Search and Filters */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <div className="relative w-full sm:w-[300px]">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search students..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-8"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Submissions</SelectItem>
                                            <SelectItem value="submitted">Submitted</SelectItem>
                                            <SelectItem value="late">Late</SelectItem>
                                            <SelectItem value="graded">Graded</SelectItem>
                                            <SelectItem value="not_submitted">Not Submitted</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {filteredSubmissions.length > 0 ? (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Submitted</TableHead>
                                                <TableHead>Grade</TableHead>
                                                <TableHead>Files</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredSubmissions.map((submission) => (
                                                <TableRow key={submission.id}>
                                                    <TableCell className="font-medium">{submission.studentName}</TableCell>
                                                    <TableCell>{getSubmissionStatusBadge(submission.status)}</TableCell>
                                                    <TableCell>
                                                        {submission.submittedAt ? (
                                                            <>
                                                                {format(new Date(submission.submittedAt), "MMM d, yyyy")}
                                                                <div className="text-xs text-muted-foreground">
                                                                    {format(new Date(submission.submittedAt), "h:mm a")}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {submission.grade !== undefined ? (
                                                            <span className="font-medium">{submission.grade}/100</span>
                                                        ) : (
                                                            <span className="text-muted-foreground">Not graded</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {submission.files.length > 0 ? (
                                                            <div className="flex flex-col gap-1">
                                                                {submission.files.map((file) => (
                                                                    <TooltipProvider key={file.id}>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div className="flex items-center text-xs text-blue-600 hover:underline">
                                                                                    {getFileIcon(file.type)}
                                                                                    <span className="ml-1 truncate max-w-[150px]">{file.name}</span>
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>
                                                                                    {file.name} ({file.size})
                                                                                </p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">No files</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {submission.files.length > 0 && (
                                                                <Button variant="ghost" size="sm" asChild>
                                                                    <a href={submission.files[0]?.url} download target="_blank" rel="noopener noreferrer">
                                                                        <Download className="h-4 w-4 mr-1" />
                                                                        Download
                                                                    </a>
                                                                </Button>
                                                            )}
                                                            {submission.status !== "not_submitted" && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    disabled={submission.status === "graded"}
                                                                    onClick={() => {
                                                                        if (submission.status !== "graded") {
                                                                            setSelectedSubmission(submission)
                                                                            setGradingDialogOpen(true)
                                                                        }
                                                                    }}
                                                                >
                                                                    <PenLine className="h-4 w-4 mr-1" />
                                                                    Grade Assignment
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 min-h-[200px]">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                                    <p className="text-gray-500 mb-4 text-center">
                                        No submissions match your current filters. Try adjusting your search or filter criteria.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                            <div className="text-sm text-muted-foreground">
                                Last updated: {format(new Date(), "MMM d, yyyy h:mm a")}
                            </div>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export Submissions
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
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
                            Enter the marks obtained by {selectedSubmission?.studentName} out of 100.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Enter marks (0-100)"
                                value={gradeValue}
                                onChange={(e) => setGradeValue(e.target.value)}
                                min="0"
                                max="100"
                                className="flex-1"
                            />
                            <span className="text-sm text-muted-foreground">/100</span>
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
