"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/ListPage/PageHeader"
import { toast } from "sonner"
import {
    ArrowLeft,
    Calendar,
    Users,
    Download,
    Edit,
    Trash2,
    Copy,
    CheckCircle,
    XCircle,
    FileText,
    Search,
    Filter,
    Clock,
    ChevronDown,
    AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, isPast, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {Assignment} from "@/views/teacher/TeacherAssignmentList.tsx";

// Dummy data for student submissions
interface StudentSubmission {
    id: string
    student: {
        id: string
        name: string
        avatar?: string
    }
    submittedAt: string
    status: "submitted" | "late" | "graded"
    grade?: number
    feedback?: string
    attachments: {
        id: string
        name: string
        size: string
        type: string
    }[]
}

const dummySubmissions: StudentSubmission[] = [
    {
        id: "sub-1",
        student: {
            id: "std-1",
            name: "John Smith",
            avatar: "/javascript-code-abstract.png",
        },
        submittedAt: "2025-05-08T14:30:00Z",
        status: "graded",
        grade: 85,
        feedback: "Good work overall. Your explanation of the problem-solving approach was clear and well-structured.",
        attachments: [
            {
                id: "att-1",
                name: "math_homework.pdf",
                size: "1.2 MB",
                type: "application/pdf",
            },
        ],
    },
    {
        id: "sub-2",
        student: {
            id: "std-2",
            name: "Emily Johnson",
            avatar: "/stylized-ej-initials.png",
        },
        submittedAt: "2025-05-09T09:15:00Z",
        status: "submitted",
        attachments: [
            {
                id: "att-2",
                name: "algebra_solutions.docx",
                size: "850 KB",
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
            {
                id: "att-3",
                name: "calculations.xlsx",
                size: "620 KB",
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        ],
    },
    {
        id: "sub-3",
        student: {
            id: "std-3",
            name: "Michael Brown",
            avatar: "/abstract-blue-burst.png",
        },
        submittedAt: "2025-05-10T23:45:00Z",
        status: "late",
        attachments: [
            {
                id: "att-4",
                name: "late_submission.pdf",
                size: "1.5 MB",
                type: "application/pdf",
            },
        ],
    },
    {
        id: "sub-4",
        student: {
            id: "std-4",
            name: "Sarah Wilson",
            avatar: "",
        },
        submittedAt: "2025-05-07T16:20:00Z",
        status: "graded",
        grade: 92,
        feedback: "Excellent work! Your solutions were elegant and your explanations were thorough.",
        attachments: [
            {
                id: "att-5",
                name: "assignment_solutions.pdf",
                size: "1.8 MB",
                type: "application/pdf",
            },
        ],
    },
    {
        id: "sub-5",
        student: {
            id: "std-5",
            name: "David Lee",
            avatar: "",
        },
        submittedAt: "2025-05-08T10:05:00Z",
        status: "submitted",
        attachments: [
            {
                id: "att-6",
                name: "math_assignment.docx",
                size: "950 KB",
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
        ],
    },
]

// Dummy data for assignment attachments
interface AssignmentAttachment {
    id: string
    name: string
    size: string
    type: string
    uploadedAt: string
}

const dummyAttachments: AssignmentAttachment[] = [
    {
        id: "att-1",
        name: "Assignment_Instructions.pdf",
        size: "1.5 MB",
        type: "application/pdf",
        uploadedAt: "2025-05-01T10:30:00Z",
    },
    {
        id: "att-2",
        name: "Reference_Material.docx",
        size: "850 KB",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploadedAt: "2025-05-01T10:32:00Z",
    },
]

// Dummy data for assignments
const dummyAssignments: Assignment[] = [
    {
        id: "1",
        title: "Mathematics Problem Set: Algebra Fundamentals",
        description:
            "Complete problems 1-20 in Chapter 3. Show all work and explain your reasoning for each step. Focus on the algebraic manipulation techniques we covered in class last week.\n\nPay special attention to problems 15-20, which involve systems of equations and require the use of substitution or elimination methods.\n\nYour work will be graded based on correctness, completeness, and clarity of explanation.",
        subject: {
            id: "math-101",
            name: "Mathematics",
        },
        class: {
            id: "class-10a",
            name: "Class 10-A",
        },
        dueDate: "2025-05-10T23:59:59Z",
        status: "submitted",
        submissionCount: 18,
        totalStudents: 25,
        createdAt: "2025-05-01T10:30:00Z",
        attachments: 2,
    },
]

export default function AssignmentDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [submissions, setSubmissions] = useState<StudentSubmission[]>([])
    const [filteredSubmissions, setFilteredSubmissions] = useState<StudentSubmission[]>([])
    const [attachments, setAttachments] = useState<AssignmentAttachment[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("details")
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string[]>(["submitted", "late", "graded"])

    useEffect(() => {
        if (id) {
            fetchAssignmentDetails(id)
        }
    }, [id])

    useEffect(() => {
        // Filter submissions based on search query and status filters
        const filtered = submissions.filter((submission) => {
            const matchesSearch = submission.student.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter.includes(submission.status)
            return matchesSearch && matchesStatus
        })
        setFilteredSubmissions(filtered)
    }, [searchQuery, statusFilter, submissions])

    const fetchAssignmentDetails = async (assignmentId: string) => {
        setLoading(true)
        try {
            // In a real application, you would fetch from your API
            // const response = await AxiosInstance.get(`/api/academic/assignments/${assignmentId}/`)
            // setAssignment(response.data)

            // Using dummy data for now
            setTimeout(() => {
                // Find the assignment in dummy data
                const foundAssignment = dummyAssignments.find((a) => a.id === assignmentId)
                if (foundAssignment) {
                    setAssignment(foundAssignment)
                    setSubmissions(dummySubmissions)
                    setFilteredSubmissions(dummySubmissions)
                    setAttachments(dummyAttachments)
                } else {
                    toast.error("Assignment not found")
                    navigate("/teacher/assignments")
                }
                setLoading(false)
            }, 800)
        } catch (error) {
            console.error("Error fetching assignment details:", error)
            toast.error("Failed to load assignment details. Please try again.")
            setLoading(false)
        }
    }

    const handleDeleteAssignment = async () => {
        if (!assignment) return

        if (confirm("Are you sure you want to delete this assignment? This action cannot be undone.")) {
            try {
                // In a real application, you would call your API
                // await AxiosInstance.delete(`/api/academic/assignments/${assignment.id}/`)

                toast.success("Assignment deleted successfully")
                navigate("/teacher/assignments")
            } catch (error) {
                console.error("Error deleting assignment:", error)
                toast.error("Failed to delete assignment")
            }
        }
    }

    const handleDuplicateAssignment = async () => {
        if (!assignment) return

        try {
            // In a real application, you would call your API
            // const response = await AxiosInstance.post('/api/academic/assignments/duplicate/', { id: assignment.id })
            // const newAssignmentId = response.data.id

            toast.success("Assignment duplicated successfully")
            // navigate(`/teacher/assignments/${newAssignmentId}/edit`)
        } catch (error) {
            console.error("Error duplicating assignment:", error)
            toast.error("Failed to duplicate assignment")
        }
    }

    const toggleStatusFilter = (status: string) => {
        setStatusFilter((prev) => {
            if (prev.includes(status)) {
                return prev.filter((s) => s !== status)
            } else {
                return [...prev, status]
            }
        })
    }

    if (loading || !assignment) {
        return (
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <Button variant="ghost" size="sm" className="mr-2">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                    </Button>
                    <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-60 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
                </div>
            </div>
        )
    }

    const isPastDue = isPast(new Date(assignment.dueDate))
    const gradedCount = submissions.filter((s) => s.status === "graded").length
    const lateCount = submissions.filter((s) => s.status === "late").length
    const submittedCount = submissions.filter((s) => s.status === "submitted").length
    const missingCount = assignment.totalStudents - assignment.submissionCount

    // Calculate submission statistics
    const submissionRate = (assignment.submissionCount / assignment.totalStudents) * 100
    const gradingRate = submissions.length > 0 ? (gradedCount / submissions.length) * 100 : 0

    return (
        <div className="p-4 flex flex-col gap-4">
            <PageHeader
                title="Assignment Details"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Teacher", href: "/teacher" },
                    { label: "Assignments", href: "/teacher/assignments" },
                    { label: assignment.title, href: `/teacher/assignments/${assignment.id}` },
                ]}
                onRefresh={() => fetchAssignmentDetails(assignment.id)}
                onPrint={() => console.log("Printing...")}
                onExport={() => console.log("Exporting...")}
                primaryAction={{
                    label: "Edit Assignment",
                    onClick: () => navigate(`/teacher/assignments/${assignment.id}/edit`),
                    icon: <Edit className="h-4 w-4" />,
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main content - takes up 2/3 of the space on large screens */}
                <div className="lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-4 bg-white border">
                            <TabsTrigger value="details" className="data-[state=active]:bg-gray-100">
                                Details
                            </TabsTrigger>
                            <TabsTrigger value="submissions" className="data-[state=active]:bg-gray-100">
                                Submissions ({submissions.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4 mt-0">
                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                            {assignment.subject.name}
                                        </Badge>
                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                                            {assignment.class.name}
                                        </Badge>
                                        <Badge
                                            className={cn(
                                                "capitalize",
                                                assignment.status === "assigned" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
                                                assignment.status === "submitted" && "bg-blue-100 text-blue-800 hover:bg-blue-100",
                                                assignment.status === "graded" && "bg-green-100 text-green-800 hover:bg-green-100",
                                            )}
                                        >
                                            {assignment.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl font-semibold text-gray-800">{assignment.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 pb-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <p className="text-gray-700 whitespace-pre-line">{assignment.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">Assignment Details</h3>
                                            <div className="space-y-3 bg-gray-50 p-4 rounded-md">
                                                <div className="flex items-center text-sm">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                                    <span
                                                        className={cn(
                                                            "text-gray-700",
                                                            isPastDue && assignment.status !== "graded" && "text-red-600 font-medium",
                                                        )}
                                                    >
                            Due: {format(new Date(assignment.dueDate), "MMMM d, yyyy 'at' h:mm a")}
                          </span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                                                    <span className="text-gray-700">
                            Submissions: {assignment.submissionCount}/{assignment.totalStudents}
                          </span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                                    <span className="text-gray-700">
                            Created: {format(new Date(assignment.createdAt), "MMMM d, yyyy")}
                          </span>
                                                </div>
                                                {isPastDue && (
                                                    <div className="flex items-center text-sm">
                                                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                                        <span className="text-gray-700">
                              Due date passed {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                            </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {attachments.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-3">Attachments</h3>
                                                <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                                                    {attachments.map((attachment) => (
                                                        <div
                                                            key={attachment.id}
                                                            className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-100 hover:border-gray-200 transition-colors"
                                                        >
                                                            <div className="flex items-center">
                                                                <FileText className="h-5 w-5 mr-3 text-blue-600" />
                                                                <div>
                                                                    <p className="text-sm font-medium">{attachment.name}</p>
                                                                    <p className="text-xs text-gray-500">{attachment.size}</p>
                                                                </div>
                                                            </div>
                                                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between pt-2 border-t bg-gray-50">
                                    <div className="text-xs text-gray-500">
                                        Last updated: {format(new Date(assignment.createdAt), "MMMM d, yyyy")}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={handleDuplicateAssignment}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Duplicate
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-600" onClick={handleDeleteAssignment}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="submissions" className="space-y-4 mt-0">
                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <CardTitle>Student Submissions</CardTitle>
                                            <CardDescription>
                                                {submissions.length} of {assignment.totalStudents} students have submitted
                                            </CardDescription>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                                <Input
                                                    type="search"
                                                    placeholder="Search students..."
                                                    className="pl-8 w-full sm:w-[200px]"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="flex items-center gap-1">
                                                        <Filter className="h-4 w-4 mr-1" />
                                                        Filter
                                                        <ChevronDown className="h-4 w-4 ml-1" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuCheckboxItem
                                                        checked={statusFilter.includes("submitted")}
                                                        onCheckedChange={() => toggleStatusFilter("submitted")}
                                                    >
                                                        Submitted
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        checked={statusFilter.includes("late")}
                                                        onCheckedChange={() => toggleStatusFilter("late")}
                                                    >
                                                        Late
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        checked={statusFilter.includes("graded")}
                                                        onCheckedChange={() => toggleStatusFilter("graded")}
                                                    >
                                                        Graded
                                                    </DropdownMenuCheckboxItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {filteredSubmissions.length === 0 ? (
                                        <div className="text-center py-12 px-4">
                                            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">No submissions found</h3>
                                            <p className="text-gray-500 max-w-md mx-auto">
                                                {submissions.length > 0
                                                    ? "No submissions match your current filters. Try adjusting your search or filters."
                                                    : "No students have submitted this assignment yet."}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {filteredSubmissions.map((submission) => (
                                                <div key={submission.id} className="hover:bg-gray-50">
                                                    <div className="p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center">
                                                                <Avatar className="h-10 w-10 mr-3">
                                                                    <AvatarImage
                                                                        src={submission.student.avatar || "/placeholder.svg?height=40&width=40&query=user"}
                                                                        alt={submission.student.name}
                                                                    />
                                                                    <AvatarFallback>
                                                                        {submission.student.name
                                                                            .split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium text-gray-800">{submission.student.name}</p>
                                                                    <div className="flex items-center text-xs text-gray-500">
                                                                        <Calendar className="h-3 w-3 mr-1" />
                                                                        <span>
                                      {format(new Date(submission.submittedAt), "MMM d, yyyy")} at{" "}
                                                                            {format(new Date(submission.submittedAt), "h:mm a")}
                                    </span>
                                                                        {submission.status === "late" && (
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="ml-2 bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1 py-0 h-4"
                                                                            >
                                                                                LATE
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                className={cn(
                                                                    "capitalize",
                                                                    submission.status === "submitted" && "bg-blue-100 text-blue-800",
                                                                    submission.status === "late" && "bg-amber-100 text-amber-800",
                                                                    submission.status === "graded" && "bg-green-100 text-green-800",
                                                                )}
                                                            >
                                                                {submission.status === "submitted" ? "Needs Grading" : submission.status}
                                                            </Badge>
                                                        </div>

                                                        {submission.attachments.length > 0 && (
                                                            <div className="mb-3">
                                                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                                                    Attachments
                                                                </h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                    {submission.attachments.map((attachment) => (
                                                                        <div
                                                                            key={attachment.id}
                                                                            className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100"
                                                                        >
                                                                            <div className="flex items-center overflow-hidden">
                                                                                <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-blue-600" />
                                                                                <div className="min-w-0">
                                                                                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                                                                                    <p className="text-xs text-gray-500">{attachment.size}</p>
                                                                                </div>
                                                                            </div>
                                                                            <Button variant="ghost" size="sm" className="flex-shrink-0">
                                                                                <Download className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {submission.status === "graded" ? (
                                                            <div className="bg-gray-50 p-3 rounded-md">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        Grading Details
                                                                    </h4>
                                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                        {submission.grade}/100
                                                                    </Badge>
                                                                </div>

                                                                {submission.feedback && (
                                                                    <div>
                                                                        <h4 className="text-xs font-medium text-gray-500 mb-1">Feedback:</h4>
                                                                        <p className="text-sm text-gray-700 p-2 bg-white rounded-md border border-gray-100">
                                                                            {submission.feedback}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-end">
                                                                <Button size="sm">Grade Submission</Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between py-3 border-t bg-gray-50">
                                    <div className="text-sm text-gray-500">
                                        Showing {filteredSubmissions.length} of {submissions.length} submissions
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download All
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar - takes up 1/3 of the space on large screens */}
                <div className="space-y-4 lg:sticky lg:top-[calc(50vh-25%)] self-start max-h-[90vh] lg:overflow-y-auto">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Submission Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-3">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-600">Submission Rate</span>
                                    <span className="text-sm font-medium">
                    {assignment.submissionCount}/{assignment.totalStudents}
                  </span>
                                </div>
                                <Progress value={submissionRate} className="h-2" />
                                <p className="text-xs text-gray-500 mt-1">{submissionRate.toFixed(0)}% of students have submitted</p>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-600">Grading Progress</span>
                                    <span className="text-sm font-medium">
                    {gradedCount}/{submissions.length}
                  </span>
                                </div>
                                <Progress value={gradingRate} className="h-2" />
                                <p className="text-xs text-gray-500 mt-1">{gradingRate.toFixed(0)}% of submissions have been graded</p>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                        <span className="text-sm">Graded</span>
                                    </div>
                                    <span className="text-sm font-medium">{gradedCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 text-blue-600 mr-2" />
                                        <span className="text-sm">Submitted</span>
                                    </div>
                                    <span className="text-sm font-medium">{submittedCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                                        <span className="text-sm">Late</span>
                                    </div>
                                    <span className="text-sm font-medium">{lateCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <XCircle className="h-4 w-4 text-red-600 mr-2" />
                                        <span className="text-sm">Missing</span>
                                    </div>
                                    <span className="text-sm font-medium">{missingCount}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Button variant="outline" className="w-full">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download All Submissions
                                </Button>

                                <Button variant="outline" className="w-full">
                                    <Users className="h-4 w-4 mr-2" />
                                    View Student List
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Due Date Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-3">
                            <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                <span
                                    className={cn(
                                        "text-gray-700",
                                        isPastDue && assignment.status !== "graded" && "text-red-600 font-medium",
                                    )}
                                >
                  {format(new Date(assignment.dueDate), "MMMM d, yyyy")}
                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-gray-700">{format(new Date(assignment.dueDate), "h:mm a")}</span>
                            </div>

                            {isPastDue ? (
                                <div className="bg-red-50 border border-red-100 rounded-md p-3 mt-2">
                                    <div className="flex items-start">
                                        <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-red-800">Due date has passed</p>
                                            <p className="text-xs text-red-700 mt-1">
                                                This assignment was due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-2">
                                    <div className="flex items-start">
                                        <Clock className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">Due date approaching</p>
                                            <p className="text-xs text-blue-700 mt-1">
                                                This assignment is due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
