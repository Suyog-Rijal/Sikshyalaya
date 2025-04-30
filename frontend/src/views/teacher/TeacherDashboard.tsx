"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, Calendar, Clock, CheckSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface TeacherData {
    name: string
    avatar: string
    department: string
    todaySchedule: {
        id: string
        subject: string
        class: string
        time: string
        room: string
    }[]
    upcomingAssessments: {
        id: string
        title: string
        type: "Assignment" | "Quiz" | "Test" | "Exam"
        class: string
        dueDate: string
    }[]
    leaveRequests: {
        id: string
        student: string
        class: string
        requestDate: string
        fromDate: string
        toDate: string
        reason: string
        status: "Pending" | "Approved" | "Rejected"
    }[]
    announcements: {
        id: string
        title: string
        date: string
        priority: "Low" | "Medium" | "High"
    }[]
}

export function TeacherDashboard() {
    const [teacherData, setTeacherData] = useState<TeacherData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate API call to fetch teacher data
        setTimeout(() => {
            const mockTeacherData: TeacherData = {
                name: "Slade Juarez",
                avatar: "/teacher-avatar.png",
                department: "Science",
                todaySchedule: [
                    {
                        id: "s1",
                        subject: "English",
                        class: "Class One-A",
                        time: "10:30 AM - 11:30 AM",
                        room: "Class One",
                    },
                    {
                        id: "s2",
                        subject: "Nepali",
                        class: "Class Two-B",
                        time: "1:15 PM - 2:45 PM",
                            room: "Class BigBen",
                    },
                    {
                        id: "s3",
                        subject: "English",
                        class: "Class One-B",
                        time: "3:30 PM - 4:30 PM",
                        room: "Tilicho",
                    },
                ],
                upcomingAssessments: [
                    {
                        id: "a1",
                        title: "Nepali Quiz test",
                        type: "Quiz",
                        class: "Grade One-A",
                        dueDate: "2024-05-10",
                    },
                    {
                        id: "a2",
                        title: "English essay writing (1000 word)",
                        type: "Assignment",
                        class: "Grade Two-B",
                        dueDate: "2024-05-15",
                    },
                    // {
                    //     id: "a3",
                    //     title: "Mid-Term Examination",
                    //     type: "Exam",
                    //     class: "Grade 11-A",
                    //     dueDate: "2024-05-20",
                    // },
                    // {
                    //     id: "a4",
                    //     title: "Quantum Physics Presentation",
                    //     type: "Assignment",
                    //     class: "Grade 12-B",
                    //     dueDate: "2024-05-25",
                    // },
                ],
                leaveRequests: [
                    {
                        id: "l1",
                        student: "Alex Chen",
                        class: "Grade 11-A",
                        requestDate: "2024-05-02",
                        fromDate: "2024-05-10",
                        toDate: "2024-05-12",
                        reason: "Family event",
                        status: "Pending",
                    },
                    {
                        id: "l2",
                        student: "Maya Patel",
                        class: "Grade 12-B",
                        requestDate: "2024-05-01",
                        fromDate: "2024-05-15",
                        toDate: "2024-05-16",
                        reason: "Medical appointment",
                        status: "Approved",
                    },
                    {
                        id: "l3",
                        student: "James Wilson",
                        class: "Grade 11-A",
                        requestDate: "2024-04-28",
                        fromDate: "2024-05-05",
                        toDate: "2024-05-07",
                        reason: "Sports competition",
                        status: "Rejected",
                    },
                    {
                        id: "l4",
                        student: "Sophia Garcia",
                        class: "Grade 12-B",
                        requestDate: "2024-05-03",
                        fromDate: "2024-05-20",
                        toDate: "2024-05-21",
                        reason: "Family emergency",
                        status: "Pending",
                    },
                ],
                announcements: [
                    {
                        id: "n1",
                        title: "Science Fair Registration Deadline",
                        date: "2024-05-10",
                        priority: "High",
                    },
                    {
                        id: "n2",
                        title: "Department Meeting Rescheduled",
                        date: "2024-05-12",
                        priority: "Medium",
                    },
                    {
                        id: "n3",
                        title: "New Lab Equipment Arrived",
                        date: "2024-05-05",
                        priority: "Low",
                    },
                ],
            }

            setTeacherData(mockTeacherData)
            setLoading(false)
        }, 1500)
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return format(date, "MMMM dd, yyyy")
    }

    const getAssessmentBadge = (type: string) => {
        switch (type) {
            case "Quiz":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Quiz
                    </Badge>
                )
            case "Assignment":
                return (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Assignment
                    </Badge>
                )
            case "Test":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Test
                    </Badge>
                )
            case "Exam":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Exam
                    </Badge>
                )
            default:
                return null
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Pending":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Pending
                    </Badge>
                )
            case "Approved":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Approved
                    </Badge>
                )
            case "Rejected":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Rejected
                    </Badge>
                )
            default:
                return null
        }
    }

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "High":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        High
                    </Badge>
                )
            case "Medium":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Medium
                    </Badge>
                )
            case "Low":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Low
                    </Badge>
                )
            default:
                return null
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex flex-col gap-6">
                <div className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>
                    <div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>
                    <div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>
                    <div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
                    <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
                </div>
            </div>
        )
    }

    if (!teacherData) return null

    const currentDate = new Date()
    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy")

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header with Teacher Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 rounded-lg shadow-xs">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-gray-100">
                        <AvatarImage src={teacherData.avatar || "/placeholder.svg"} alt={teacherData.name} />
                        <AvatarFallback>
                            {teacherData.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome, {teacherData.name}</h1>
                        <p className="text-gray-500">
                            {teacherData.department} • {formattedDate}
                        </p>
                    </div>
                </div>

            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Card className="shadow-md border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Classes</p>
                                <h3 className="text-2xl font-bold mt-1">3</h3>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-full">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Students</p>
                                <h3 className="text-2xl font-bold mt-1">5</h3>
                            </div>
                            <div className="bg-green-50 p-3 rounded-full">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Today's Classes</p>
                                <h3 className="text-2xl font-bold mt-1">{teacherData.todaySchedule.length}</h3>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-full">
                                <Calendar className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending Leaves</p>
                                <h3 className="text-2xl font-bold mt-1">
                                    {teacherData.leaveRequests.filter((l) => l.status === "Pending").length}
                                </h3>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-full">
                                <CheckSquare className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content - 2x2 Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Today's Schedule */}
                <Card className="shadow-md border-0">
                    <CardHeader className="pb-2">
                        <CardTitle>Today's Schedule</CardTitle>
                        <CardDescription>Your classes and meetings for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {teacherData.todaySchedule.map((schedule) => (
                                <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2.5 rounded-md">
                                            <Clock className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{schedule.subject}</h4>
                                            <p className="text-sm text-gray-500">
                                                {schedule.class} • {schedule.room}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-medium text-gray-700">{schedule.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Assessments */}
                <Card className="shadow-md border-0">
                    <CardHeader className="pb-2">
                        <CardTitle>Upcoming Assessments</CardTitle>
                        <CardDescription>Scheduled assessments for your classes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {teacherData.upcomingAssessments.slice(0, 3).map((assessment) => (
                                <div key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-sm">{assessment.title}</h4>
                                            {getAssessmentBadge(assessment.type)}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{assessment.class}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-medium text-gray-700">{formatDate(assessment.dueDate)}</span>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" className="w-full">
                                View All Assessments
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Leave Requests */}
                <Card className="shadow-md border-0">
                    <CardHeader className="pb-2">
                        <CardTitle>Leave Requests</CardTitle>
                        <CardDescription>Student leave applications requiring your attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {teacherData.leaveRequests.slice(0, 2).map((leave) => (
                                <div key={leave.id} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{leave.student}</h4>
                                            <Badge variant="outline" className="bg-gray-100">
                                                {leave.class}
                                            </Badge>
                                        </div>
                                        {getStatusBadge(leave.status)}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{leave.reason}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                    </span>
                                        <span>Requested: {formatDate(leave.requestDate)}</span>
                                    </div>
                                    {leave.status === "Pending" && (
                                        <div className="flex gap-2 mt-3">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                            >
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <Button variant="outline" size="sm" className="w-full">
                                View All Requests
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Announcements */}
                <Card className="shadow-md border-0">
                    <CardHeader className="pb-2">
                        <CardTitle>Announcements</CardTitle>
                        <CardDescription>Important notices and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {teacherData.announcements.map((announcement) => (
                                <div key={announcement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-sm">{announcement.title}</h4>
                                            {getPriorityBadge(announcement.priority)}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{formatDate(announcement.date)}</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" className="w-full">
                                View All Announcements
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
