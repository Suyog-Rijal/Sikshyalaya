"use client"

import { useState, useEffect } from "react"
import { BookOpen, Clock, Calendar, FileText } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface ExamRoutine {
    id: string
    examType: "Terminal Exam" | "Midterm Exam" | "Final Exam" | "Unit Test"
    subject: string
    class: string
    section: string
    date: string
    startTime: string
    endTime: string
    venue: string
    status: "upcoming" | "ongoing" | "completed"
}

export function StudentExam() {
    const [examRoutines, setExamRoutines] = useState<ExamRoutine[]>([])
    const [loading, setLoading] = useState(true)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return format(date, "MMMM dd, yyyy")
    }

    const formatTime = (timeString: string) => {
        return timeString
    }

    useEffect(() => {
        // Simulate API call to fetch exam routines
        setTimeout(() => {
            const mockExamRoutines: ExamRoutine[] = [
                {
                    id: "11",
                    examType: "Unit Test",
                    subject: "Mathematics",
                    class: "Grade 1",
                    section: "A",
                    date: "2024-05-02",
                    startTime: "09:00 AM",
                    endTime: "10:00 AM",
                    venue: "Room 101",
                    status: "upcoming",
                },
                {
                    id: "12",
                    examType: "Terminal Exam",
                    subject: "English",
                    class: "Grade 1",
                    section: "B",
                    date: "2024-05-15",
                    startTime: "10:30 AM",
                    endTime: "11:30 AM",
                    venue: "Room 102",
                    status: "upcoming",
                },
                {
                    id: "13",
                    examType: "Midterm Exam",
                    subject: "Science",
                    class: "Grade 2",
                    section: "A",
                    date: "2024-05-20",
                    startTime: "09:00 AM",
                    endTime: "10:30 AM",
                    venue: "Room 103",
                    status: "upcoming",
                },
                {
                    id: "14",
                    examType: "Final Exam",
                    subject: "Social Studies",
                    class: "Grade 2",
                    section: "B",
                    date: "2024-06-10",
                    startTime: "11:00 AM",
                    endTime: "12:00 PM",
                    venue: "Room 104",
                    status: "upcoming",
                },
            ]

            setExamRoutines(mockExamRoutines)
            setLoading(false)
        }, 1500)
    }, [])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "upcoming":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Upcoming
                    </Badge>
                )
            case "ongoing":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ongoing
                    </Badge>
                )
            case "completed":
                return (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Completed
                    </Badge>
                )
            default:
                return null
        }
    }

    return (
        <div className="p-6 bg-gray-50">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Exam Schedule</h1>
                <p className="text-gray-500">View your upcoming and scheduled exams</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-full">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Upcoming Exams</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {examRoutines.filter((e) => e.status === "upcoming").length} exams scheduled
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-green-50 p-3 rounded-full">
                                <Clock className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Ongoing Exams</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {examRoutines.filter((e) => e.status === "ongoing").length} exams in progress
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-gray-100 p-3 rounded-full">
                                <FileText className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Completed Exams</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {examRoutines.filter((e) => e.status === "completed").length} exams completed
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Exam Routines Table */}
            <Card className="bg-white border border-gray-200">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Exam Type</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead className="hidden md:table-cell">Class</TableHead>
                                <TableHead className="hidden lg:table-cell">Date</TableHead>
                                <TableHead className="hidden lg:table-cell">Time</TableHead>
                                <TableHead className="hidden xl:table-cell">Venue</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 4 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton className="h-5 w-24" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-32" />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Skeleton className="h-5 w-20" />
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <Skeleton className="h-5 w-28" />
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <Skeleton className="h-5 w-28" />
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            <Skeleton className="h-5 w-24" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-20" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : examRoutines.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                        No exam routines found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                examRoutines.map((exam) => (
                                    <TableRow key={exam.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">{exam.examType}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{exam.subject}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {exam.class} {exam.section}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                                <span>{formatDate(exam.date)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-gray-500" />
                                                <span>
                          {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
                        </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">{exam.venue}</TableCell>
                                        <TableCell>{getStatusBadge(exam.status)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
