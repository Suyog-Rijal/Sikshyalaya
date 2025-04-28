"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/ListPage/PageHeader"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    FileText,
    Calendar,
    Clock,
    User,
    Download,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock3,
} from "lucide-react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminAssignmentDetail() {
    const [loading, setLoading] = useState(true)
    const [assignment, setAssignment] = useState<Assignment | null>(null)
    const [submissions, setSubmissions] = useState<Submission[]>([])

    // Fetch assignment details and submissions
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockAssignment: Assignment = {
                id: "a1",
                title: "Algebra Equations Worksheet",
                class: { id: "class1", name: "Class 1" },
                section: { id: "secA", name: "Section A" },
                subject: { id: "sub1", name: "Mathematics" },
                status: "active",
                description:
                    "Complete all the algebra equations in the attached worksheet. Show your work for each problem. Make sure to follow the proper format for solving equations as discussed in class. Points will be deducted for missing steps or incorrect notation. This assignment is designed to help you prepare for the upcoming mid-term exam.",
                file: {
                    name: "algebra_worksheet.pdf",
                    url: "#",
                },
                uploadedAt: new Date("2023-04-10T09:30:00"),
                dueDate: new Date("2023-04-17T23:59:59"),
                totalSubmissions: 18,
                teacher: { id: "t1", name: "John Smith" },
                maxMarks: 50,
                instructions: [
                    "Complete all 20 problems in the worksheet",
                    "Show all steps of your work",
                    "Write your name and class on each page",
                    "Submit as a single PDF file",
                ],
            }

            const mockSubmissions: Submission[] = [
                {
                    id: "s1",
                    student: {
                        id: "std1",
                        name: "Alice Johnson",
                        avatar: "/abstract-aj.png",
                    },
                    submissionDate: new Date("2023-04-15T14:30:00"),
                    status: "submitted",
                    file: {
                        name: "alice_algebra_homework.pdf",
                        url: "#",
                    },
                    marks: 45,
                    feedback: "Excellent work! Clear steps and correct answers.",
                },
                {
                    id: "s2",
                    student: {
                        id: "std2",
                        name: "Bob Williams",
                        avatar: "/abstract-bw-shapes.png",
                    },
                    submissionDate: new Date("2023-04-16T09:15:00"),
                    status: "submitted",
                    file: {
                        name: "bob_math_assignment.pdf",
                        url: "#",
                    },
                    marks: 38,
                    feedback: "Good work, but missing steps in problems 7 and 12.",
                },
                {
                    id: "s3",
                    student: {
                        id: "std3",
                        name: "Charlie Davis",
                        avatar: "/compact-disc-reflection.png",
                    },
                    submissionDate: new Date("2023-04-17T22:45:00"),
                    status: "late",
                    file: {
                        name: "charlie_algebra.pdf",
                        url: "#",
                    },
                    marks: 32,
                    feedback: "Late submission. Several errors in the second section.",
                },
                {
                    id: "s4",
                    student: {
                        id: "std4",
                        name: "Diana Miller",
                        avatar: "/social-media-direct-message.png",
                    },
                    submissionDate: null,
                    status: "pending",
                    file: null,
                    marks: null,
                    feedback: null,
                },
                {
                    id: "s5",
                    student: {
                        id: "std5",
                        name: "Ethan Brown",
                        avatar: "/electric-blue-abstract.png",
                    },
                    submissionDate: new Date("2023-04-14T16:20:00"),
                    status: "submitted",
                    file: {
                        name: "ethan_math_hw.pdf",
                        url: "#",
                    },
                    marks: 48,
                    feedback: "Outstanding work! Very thorough and well-organized.",
                },
                {
                    id: "s6",
                    student: {
                        id: "std6",
                        name: "Fiona Garcia",
                        avatar: "/abstract-fg.png",
                    },
                    submissionDate: new Date("2023-04-16T11:05:00"),
                    status: "resubmit",
                    file: {
                        name: "fiona_algebra_assignment.pdf",
                        url: "#",
                    },
                    marks: 25,
                    feedback: "Please resubmit with corrections to problems 3, 8, 14, and 19.",
                },
            ]

            setAssignment(mockAssignment)
            setSubmissions(mockSubmissions)
            setLoading(false)
        }, 1000)
    }, [])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            case "expired":
                return <Badge variant="destructive">Expired</Badge>
            case "draft":
                return <Badge variant="outline">Draft</Badge>
            case "inactive":
                return <Badge variant="secondary">Inactive</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getSubmissionStatusBadge = (status: string) => {
        switch (status) {
            case "submitted":
                return <Badge className="bg-green-500 hover:bg-green-600">Submitted</Badge>
            case "late":
                return (
                    <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600">
                        Late
                    </Badge>
                )
            case "pending":
                return <Badge variant="outline">Pending</Badge>
            case "resubmit":
                return <Badge variant="destructive">Resubmit</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getSubmissionStatusIcon = (status: string) => {
        switch (status) {
            case "submitted":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case "late":
                return <Clock3 className="h-4 w-4 text-amber-500" />
            case "pending":
                return <AlertCircle className="h-4 w-4 text-gray-400" />
            case "resubmit":
                return <XCircle className="h-4 w-4 text-red-500" />
            default:
                return null
        }
    }

    if (loading) {
        return (
            <div className="p-4 flex flex-col gap-4">
                <div className="h-10 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
        )
    }

    if (!assignment) {
        return (
            <div className="p-4 flex flex-col gap-4">
                <PageHeader
                    title="Assignment Not Found"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Assignment", href: "/assignment/list" },
                        { label: "Not Found", href: "#" },
                    ]}
                />
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Assignment not found</h3>
                    <p className="text-muted-foreground mt-1">
                        The assignment you're looking for doesn't exist or has been removed
                    </p>
                    <Button variant="outline" className="mt-4 gap-2" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                        Back to Assignments
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <PageHeader
                title="Assignment Details"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Assignments", href: "/assignment/list" },
                    { label: assignment.title, href: "#" },
                ]}
            />

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="details">Assignment Details</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                <div>
                                    <CardTitle className="text-xl">{assignment.title}</CardTitle>
                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                                        <span>{assignment.class.name}</span>
                                        <span>•</span>
                                        <span>{assignment.section.name}</span>
                                        <span>•</span>
                                        <span>{assignment.subject.name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(assignment.status)}
                                    <Badge variant="outline" className="font-normal">
                                        Max Marks: {assignment.maxMarks}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-2">Description</h3>
                                <p className="text-sm text-muted-foreground">{assignment.description}</p>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Instructions</h3>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    {assignment.instructions.map((instruction, index) => (
                                        <li key={index}>{instruction}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-3">
                                    <h3 className="font-medium">Assignment Details</h3>
                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-muted-foreground">Teacher:</span>
                                        </div>
                                        <div>{assignment.teacher.name}</div>

                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-muted-foreground">Due Date:</span>
                                        </div>
                                        <div>{format(assignment.dueDate, "MMM d, yyyy 'at' h:mm a")}</div>

                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-muted-foreground">Uploaded:</span>
                                        </div>
                                        <div>{format(assignment.uploadedAt, "MMM d, yyyy 'at' h:mm a")}</div>

                                        <div className="flex items-center gap-1.5">
                                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-muted-foreground">Submissions:</span>
                                        </div>
                                        <div>{assignment.totalSubmissions}</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-medium">Submission Statistics</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="border rounded-lg p-3 text-center">
                                            <div className="text-2xl font-semibold text-green-500">
                                                {submissions.filter((s) => s.status === "submitted").length}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Submitted</div>
                                        </div>
                                        <div className="border rounded-lg p-3 text-center">
                                            <div className="text-2xl font-semibold text-amber-500">
                                                {submissions.filter((s) => s.status === "late").length}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Late</div>
                                        </div>
                                        <div className="border rounded-lg p-3 text-center">
                                            <div className="text-2xl font-semibold text-red-500">
                                                {submissions.filter((s) => s.status === "resubmit").length}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Resubmit</div>
                                        </div>
                                        <div className="border rounded-lg p-3 text-center">
                                            <div className="text-2xl font-semibold text-gray-500">
                                                {submissions.filter((s) => s.status === "pending").length}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Pending</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                            {assignment.file ? (
                                <Button variant="outline" className="gap-2">
                                    <Download className="h-4 w-4" />
                                    Download {assignment.file.name}
                                </Button>
                            ) : (
                                <span className="text-sm text-muted-foreground">No file attached</span>
                            )}
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="submissions" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Student Submissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Submitted Date</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {submissions.length > 0 ? (
                                            submissions.map((submission) => (
                                                <TableRow key={submission.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage
                                                                    src={submission.student.avatar || "/placeholder.svg"}
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
                                                                <div className="font-medium">{submission.student.name}</div>
                                                                <div className="text-xs text-muted-foreground">ID: {submission.student.id}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {submission.submissionDate
                                                            ? format(submission.submissionDate, "MMM d, yyyy")
                                                            : "Not submitted"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            {getSubmissionStatusIcon(submission.status)}
                                                            {getSubmissionStatusBadge(submission.status)}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-6">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                                                        <h3 className="font-medium">No submissions yet</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            There are no submissions for this assignment
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Types
interface Assignment {
    id: string
    title: string
    class: {
        id: string
        name: string
    }
    section: {
        id: string
        name: string
    }
    subject: {
        id: string
        name: string
    }
    status: string
    description: string
    file: {
        name: string
        url: string
    } | null
    uploadedAt: Date
    dueDate: Date
    totalSubmissions: number
    teacher: {
        id: string
        name: string
    }
    maxMarks: number
    instructions: string[]
}

interface Submission {
    id: string
    student: {
        id: string
        name: string
        avatar: string
    }
    submissionDate: Date | null
    status: "submitted" | "late" | "pending" | "resubmit"
    file: {
        name: string
        url: string
    } | null
    marks: number | null
    feedback: string | null
}
