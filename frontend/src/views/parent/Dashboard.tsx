"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import {
    Calendar,
    Bell,
    Clock,
    CheckCircle,
    AlertCircle,
    CreditCard,
    MessageSquare,
    ChevronRight,
    FileText,
    GraduationCap,
    BookOpen,
    BarChart3,
} from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface Parent {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
}

interface Child {
    id: string
    name: string
    grade: string
    section: string
    rollNumber: number
    profilePicture: string | null
    attendance: {
        present: number
        absent: number
        total: number
    }
}

interface ClassSchedule {
    id: string
    subject: string
    time: string
    teacher: string
    room: string
}

interface Assignment {
    id: string
    title: string
    subject: string
    dueDate: string
    status: "Pending" | "Submitted" | "Graded"
}

interface Exam {
    id: string
    title: string
    subject: string
    date: string
    time: string
    room: string
}

interface Announcement {
    id: string
    title: string
    date: string
    priority: "High" | "Medium" | "Low"
}

interface Fee {
    id: string
    type: string
    amount: number
    dueDate: string
    status: "Paid" | "Pending" | "Overdue" | "Partial"
    paidAmount: number
}

interface Message {
    id: string
    from: string
    subject: string
    date: string
    read: boolean
}

export function ParentDashboard() {
    const [parent, setParent] = useState<Parent | null>(null)
    const [child, setChild] = useState<Child | null>(null)
    const [todaySchedule, setTodaySchedule] = useState<ClassSchedule[]>([])
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [exams, setExams] = useState<Exam[]>([])
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [fees, setFees] = useState<Fee[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate API call to fetch data
        setTimeout(() => {
            const mockParent: Parent = {
                id: "P12345",
                name: "Castor Curtis",
                email: "morgan.golden@example.com",
                phone: "+1 (555) 123-4567",
                avatar: "/parent-avatar.png",
            }

            const mockChild: Child = {
                id: "S12345",
                name: "Wyoming Golden",
                grade: "One",
                section: "A",
                rollNumber: 15,
                profilePicture: "/student-avatar.png",
                attendance: {
                    present: 7,
                    absent: 1,
                    total: 8,
                },
            }

            const mockTodaySchedule: ClassSchedule[] = [
                {
                    id: "1",
                    subject: "Nepali",
                    time: "10:00 AM - 10:45 AM",
                    teacher: "Madeline Gomez",
                    room: "Class one (A)",
                },
                {
                    id: "2",
                    subject: "English",
                    time: "10:45 AM - 11:30 AM",
                    teacher: "Slade Juarez",
                    room: "Class one (A)",
                },
                {
                    id: "3",
                    subject: "Gk",
                    time: "11:30 AM - 12:15 PM",
                    teacher: "Signe Mccormick",
                    room: "Class one (A)",
                },
                {
                    id: "4",
                    subject: "English",
                    time: "12:15 PM - 1:00 PM",
                    teacher: "Slade Juarez",
                    room: "Class one (A)",
                },
            ]

            const mockAssignments: Assignment[] = [
                {
                    id: "1",
                    title: "Algebra set 1",
                    subject: "Maths",
                    dueDate: "2024-05-15",
                    status: "Pending",
                },
            ]

            const mockExams: Exam[] = [
                {
                    id: "1",
                    title: "Mid-Term Examination",
                    subject: "Mathematics",
                    date: "2024-05-25",
                    time: "9:00 AM - 11:00 AM",
                    room: "Hall 1",
                },
                {
                    id: "2",
                    title: "Science Practical Test",
                    subject: "Science",
                    date: "2024-05-28",
                    time: "1:00 PM - 3:00 PM",
                    room: "Lab 2",
                },
            ]

            const mockAnnouncements: Announcement[] = [
                {
                    id: "1",
                    title: "School Sports Day on May 20th",
                    date: "2024-05-05",
                    priority: "Medium",
                },
                {
                    id: "2",
                    title: "Parent-Teacher Meeting on May 15th",
                    date: "2024-05-03",
                    priority: "High",
                },
                {
                    id: "3",
                    title: "Library Book Return Deadline: May 25th",
                    date: "2024-05-01",
                    priority: "Low",
                },
            ]

            const mockFees: Fee[] = [
                {
                    id: "F1001",
                    type: "Tuition Fee (May)",
                    amount: 5000,
                    dueDate: "2024-05-10",
                    status: "Pending",
                    paidAmount: 0,
                },
                {
                    id: "F1002",
                    type: "Transportation Fee",
                    amount: 1500,
                    dueDate: "2024-05-05",
                    status: "Paid",
                    paidAmount: 1500,
                },
                {
                    id: "F1003",
                    type: "Library Fee",
                    amount: 500,
                    dueDate: "2024-04-30",
                    status: "Overdue",
                    paidAmount: 0,
                },
            ]

            const mockMessages: Message[] = [
                {
                    id: "M1001",
                    from: "Madeline Gomez (Nepali Teacher)",
                    subject: "Wyoming's progress in Nepali class",
                    date: "2024-05-07",
                    read: false,
                },
                {
                    id: "M1002",
                    from: "Class Teacher",
                    subject: "Upcoming Parent-Teacher Meeting",
                    date: "2024-05-03",
                    read: true,
                },
                {
                    id: "M1003",
                    from: "Principal's Office",
                    subject: "School Timing Change Notice",
                    date: "2024-05-01",
                    read: true,
                },
            ]

            setParent(mockParent)
            setChild(mockChild)
            setTodaySchedule(mockTodaySchedule)
            setAssignments(mockAssignments)
            setExams(mockExams)
            setAnnouncements(mockAnnouncements)
            setFees(mockFees)
            setMessages(mockMessages)
            setLoading(false)
        }, 1500)
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return format(date, "MMM dd, yyyy")
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "NPR",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Paid":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Paid
                    </Badge>
                )
            case "Pending":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Pending
                    </Badge>
                )
            case "Overdue":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        Overdue
                    </Badge>
                )
            case "Partial":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Partial
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
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                        High
                    </Badge>
                )
            case "Medium":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                        Medium
                    </Badge>
                )
            case "Low":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        Low
                    </Badge>
                )
            default:
                return null
        }
    }

    // Calculate fee statistics
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0)
    const paidFees = fees.reduce((sum, fee) => sum + fee.paidAmount, 0)
    const pendingFees = totalFees - paidFees
    const feePaymentPercentage = totalFees > 0 ? (paidFees / totalFees) * 100 : 0

    if (loading) {
        return (
            <div className="p-8 flex flex-col gap-8">
                <div className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>
                    <div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
                    <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
                </div>
            </div>
        )
    }

    if (!parent || !child) return null

    const currentDate = new Date()
    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy")
    const attendancePercentage = Math.round((child.attendance.present / child.attendance.total) * 100)

    return (
        <div className="min-h-screen bg-gray-50">


            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Welcome, {parent.name}</h2>
                    <p className="text-gray-500">{formattedDate}</p>
                </div>

                {/* Child Overview */}
                <div className="mb-8">
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Your Child</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-gray-200">
                                    <AvatarImage src={child.profilePicture || "/placeholder.svg"} alt={child.name} />
                                    <AvatarFallback>
                                        {child.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800">{child.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Grade {child.grade}-{child.section} • Roll #{child.rollNumber}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Row - Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Attendance Card */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" /> Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="mb-2">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-600">Present: {child.attendance.present} days</span>
                                    <span className="text-sm font-medium">{attendancePercentage}%</span>
                                </div>
                                <Progress value={attendancePercentage} className="h-2" />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Absent: {child.attendance.absent} days</span>
                                <span>Total: {child.attendance.total} days</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academic Card */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" /> Academic
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">Pending Assignments</span>
                                <span className="text-sm font-medium">{assignments.filter((a) => a.status === "Pending").length}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">Upcoming Exams</span>
                                <span className="text-sm font-medium">{exams.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Unread Messages</span>
                                <span className="text-sm font-medium">{messages.filter((m) => !m.read).length}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fee Card */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <CreditCard className="h-5 w-5" /> Fee Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="mb-2">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-600">Payment Status</span>
                                    <span className="text-sm font-medium">{feePaymentPercentage.toFixed(1)}% Paid</span>
                                </div>
                                <Progress value={feePaymentPercentage} className="h-2" />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Paid: {formatCurrency(paidFees)}</span>
                                <span>Pending: {formatCurrency(pendingFees)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Row - Schedule and Assignments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Today's Schedule */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" /> Today's Schedule
                                </div>
                                <span className="text-sm text-gray-500">{format(currentDate, "EEEE")}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="space-y-4">
                                {todaySchedule.map((cls, index) => (
                                    <div key={cls.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-100 p-2 rounded-full">
                                                    <BookOpen className="h-4 w-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{cls.subject}</h4>
                                                    <p className="text-xs text-gray-500">{cls.teacher}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-700">{cls.time}</p>
                                                <p className="text-xs text-gray-500">{cls.room}</p>
                                            </div>
                                        </div>
                                        {index < todaySchedule.length - 1 && <Separator className="my-4" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fee Details */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" /> Fee Details
                                </div>
                                <Button variant="ghost" size="sm" className="text-gray-500 gap-1 text-xs">
                                    View all <ChevronRight className="h-3 w-3" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="space-y-4">
                                {fees.map((fee, index) => (
                                    <div key={fee.id}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-800">{fee.type}</h4>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>Due: {formatDate(fee.dueDate)}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatCurrency(fee.amount)}</p>
                                                <div>{getStatusBadge(fee.status)}</div>
                                            </div>
                                        </div>
                                        {index < fees.length - 1 && <Separator className="my-4" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t">
                            <Button className="w-full">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Pay Fees Online
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Bottom Row - Exams, Assignments, and Messages */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Exams */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" /> Upcoming Exams
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="space-y-4">
                                {exams.map((exam, index) => (
                                    <div key={exam.id}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-800">{exam.title}</h4>
                                                <p className="text-xs text-gray-500">{exam.subject}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-medium text-gray-800">{formatDate(exam.date)}</p>
                                                <p className="text-xs text-gray-500">{exam.time}</p>
                                            </div>
                                        </div>
                                        {index < exams.length - 1 && <Separator className="my-4" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assignments */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" /> Assignments
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="space-y-4">
                                {assignments.length === 0 ? (
                                    <p className="text-center text-gray-500 py-4">No pending assignments.</p>
                                ) : (
                                    assignments.map((assignment, index) => (
                                        <div key={assignment.id}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                                                    <p className="text-xs text-gray-500">{assignment.subject}</p>
                                                </div>
                                                <div className="text-right">
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                            {assignment.status}
                          </span>
                                                    <p className="text-xs text-gray-500 mt-1">{formatDate(assignment.dueDate)}</p>
                                                </div>
                                            </div>
                                            {index < assignments.length - 1 && <Separator className="my-4" />}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Messages */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" /> Messages
                                </div>
                                <Button variant="ghost" size="sm" className="text-gray-500 gap-1 text-xs">
                                    View all <ChevronRight className="h-3 w-3" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div key={message.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-gray-800">{message.subject}</h4>
                                                    {!message.read && <Badge className="bg-blue-500 text-white hover:bg-blue-600">New</Badge>}
                                                </div>
                                                <p className="text-sm text-gray-500">{message.from}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>{formatDate(message.date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {index < messages.length - 1 && <Separator className="my-4" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t">
                            <Button variant="outline" className="w-full">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Contact Teacher
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Announcements */}
                <div className="mt-8">
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" /> School Announcements
                                </div>
                                <Button variant="ghost" size="sm" className="text-gray-500 gap-1 text-xs">
                                    View all <ChevronRight className="h-3 w-3" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="space-y-4">
                                {announcements.map((announcement, index) => (
                                    <div key={announcement.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-100 p-2 rounded-full">
                                                    <Bell className="h-4 w-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{announcement.title}</h4>
                                                    <p className="text-xs text-gray-500">{formatDate(announcement.date)}</p>
                                                </div>
                                            </div>
                                            <div>{getPriorityBadge(announcement.priority)}</div>
                                        </div>
                                        {index < announcements.length - 1 && <Separator className="my-4" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                            <FileText className="h-6 w-6" />
                            <span>Download Report Card</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                            <MessageSquare className="h-6 w-6" />
                            <span>Contact Teacher</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                            <CreditCard className="h-6 w-6" />
                            <span>Pay Fees</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                            <Calendar className="h-6 w-6" />
                            <span>School Calendar</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
