"use client"

import { useState, useEffect } from "react"
import { BookOpen, Clock, Calendar, Bell, ChevronRight, FileText, GraduationCap, BarChart3, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface Student {
    id: string
    name: string
    profilePicture: string | null
    grade: string
    section: string
    rollNumber: number
    attendance: {
        present: number
        absent: number
        total: number
    }
    gpa: string
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

export function StudentDashboard() {
    const [student, setStudent] = useState<Student | null>(null)
    const [todaySchedule, setTodaySchedule] = useState<ClassSchedule[]>([])
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [exams, setExams] = useState<Exam[]>([])
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate API call to fetch student data
        setTimeout(() => {
            const mockStudent: Student = {
                id: "S12345",
                name: "Wyoming Golden",
                profilePicture: "/student-avatar.png",
                grade: "One",
                section: "A",
                rollNumber: 15,
                attendance: {
                    present: 7,
                    absent: 1,
                    total: 8,
                },
                gpa: "3.8",
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
                    id: "3",
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
                // {
                //     id: "2",
                //     title: "Science Lab Report",
                //     subject: "Science",
                //     dueDate: "2024-05-10",
                //     status: "Submitted",
                // },
                // {
                //     id: "3",
                //     title: "Essay on Shakespeare",
                //     subject: "English",
                //     dueDate: "2024-05-08",
                //     status: "Graded",
                // },
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

            setStudent(mockStudent)
            setTodaySchedule(mockTodaySchedule)
            setAssignments(mockAssignments)
            setExams(mockExams)
            setAnnouncements(mockAnnouncements)
            setLoading(false)
        }, 1500)
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return format(date, "MMM dd, yyyy")
    }

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

    if (!student) return null

    const currentDate = new Date()
    const formattedDate = format(currentDate, "EEEE, MMMM dd, yyyy")
    const attendancePercentage = Math.round((student.attendance.present / student.attendance.total) * 100)

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Welcome back, {student.name.split(" ")[0]}</h2>
                    <p className="text-gray-500">{formattedDate}</p>
                </div>

                {/* Top Row - Student Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Profile Card */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <User className="h-5 w-5" /> Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 border-2 border-gray-200">
                                    <AvatarImage src={student.profilePicture || "/placeholder.svg"} alt={student.name} />
                                    <AvatarFallback>
                                        {student.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-medium text-gray-800">{student.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Grade {student.grade}-{student.section} • Roll #{student.rollNumber}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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
                                    <span className="text-sm text-gray-600">Present: {student.attendance.present} days</span>
                                    <span className="text-sm font-medium">{attendancePercentage}%</span>
                                </div>
                                <Progress value={attendancePercentage} className="h-2" />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Absent: {student.attendance.absent} days</span>
                                <span>Total: {student.attendance.total} days</span>
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
                                {/*<span className="text-sm text-gray-600">GPA</span>*/}
                                {/*<span className="text-sm font-medium">{student.gpa}/4.0</span>*/}
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">Pending Assignments</span>
                                <span className="text-sm font-medium">{assignments.filter((a) => a.status === "Pending").length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Upcoming Exams</span>
                                <span className="text-sm font-medium">{exams.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Row - Schedule and Assignments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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

                    {/* Assignments */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" /> Assignments
                                </div>
                                <Button variant="ghost" size="sm" className="text-gray-500 gap-1 text-xs">
                                    View all <ChevronRight className="h-3 w-3" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="space-y-4">
                                {assignments.map((assignment, index) => (
                                    <div key={assignment.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-100 p-2 rounded-full">
                                                    <FileText className="h-4 w-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                                                    <p className="text-xs text-gray-500">{assignment.subject}</p>
                                                </div>
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
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Row - Exams and Announcements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Exams */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" /> Upcoming Exams
                                </div>
                                <Button variant="ghost" size="sm" className="text-gray-500 gap-1 text-xs">
                                    View all <ChevronRight className="h-3 w-3" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="space-y-4">
                                {exams.map((exam, index) => (
                                    <div key={exam.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-100 p-2 rounded-full">
                                                    <Calendar className="h-4 w-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{exam.title}</h4>
                                                    <p className="text-xs text-gray-500">{exam.subject}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-medium text-gray-800">{formatDate(exam.date)}</p>
                                                <p className="text-xs text-gray-500">{exam.time}</p>
                                                <p className="text-xs text-gray-500">{exam.room}</p>
                                            </div>
                                        </div>
                                        {index < exams.length - 1 && <Separator className="my-4" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Announcements */}
                    <Card className="bg-white border border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" /> Announcements
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
                                            <div>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {announcement.priority}
                        </span>
                                            </div>
                                        </div>
                                        {index < announcements.length - 1 && <Separator className="my-4" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
