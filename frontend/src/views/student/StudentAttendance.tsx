"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface DailyAttendanceRecord {
    id: string
    date: string
    status: boolean
    remarks?: string | null
}

interface Student {
    id: string
    name: string
}

export function StudentAttendancePage() {
    const [rowsPerPage] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedMonth, setSelectedMonth] = useState("05") // Default to May
    const [selectedYear, setSelectedYear] = useState("2024") // Default to 2024
    const [selectedStudent] = useState<string | null>(null)
    const [loading] = useState(false)

    // Generate list of students
    const students: Student[] = useMemo(
        () => [
            { id: "1", name: "John Smith" },
            { id: "2", name: "Emily Johnson" },
            { id: "3", name: "Michael Brown" },
            { id: "4", name: "Sophia Williams" },
            { id: "5", name: "James Davis" },
            { id: "6", name: "Olivia Miller" },
            { id: "7", name: "William Wilson" },
            { id: "8", name: "Ava Moore" },
            { id: "9", name: "Alexander Taylor" },
            { id: "10", name: "Charlotte Anderson" },
            { id: "11", name: "Benjamin Thomas" },
            { id: "12", name: "Mia Jackson" },
        ],
        [],
    )

    // Generate random attendance data for each student for each day of the selected month
    const generateAttendanceData = (studentId: string, month: string, year: string): DailyAttendanceRecord[] => {
        const daysInMonth = new Date(Number.parseInt(year), Number.parseInt(month), 0).getDate()
        const records: DailyAttendanceRecord[] = []

        // Generate attendance for each day of the month (excluding weekends)
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, day)
            const dayOfWeek = date.getDay()

            // Skip weekends (0 = Sunday, 6 = Saturday)
            if (dayOfWeek === 0 || dayOfWeek === 6) continue

            const formattedDay = day.toString().padStart(2, "0")
            const dateString = `${year}-${month}-${formattedDay}`

            // Random attendance status (80% chance of being present)
            const isPresent = Math.random() < 0.8

            // Generate random remarks for some absences
            let remarks = null
            if (!isPresent && Math.random() < 0.7) {
                const absenceReasons = [
                    "Medical absence",
                    "Family emergency",
                    "Transportation issues",
                    "Excused absence",
                    "Personal reasons",
                    "Weather conditions",
                ]
                remarks = absenceReasons[Math.floor(Math.random() * absenceReasons.length)]
            }

            records.push({
                id: `${studentId}-${dateString}`,
                date: dateString,
                status: isPresent,
                remarks,
            })
        }

        return records
    }

    // Get attendance data for the selected student and month
    const attendanceData = useMemo(() => {
        if (!selectedStudent) return []
        return generateAttendanceData(selectedStudent, selectedMonth, selectedYear)
    }, [selectedStudent, selectedMonth, selectedYear])

    // Calculate summary statistics
    const totalPresentDays = attendanceData.filter((record) => record.status).length
    const totalAbsentDays = attendanceData.length - totalPresentDays
    const attendancePercentage =
        attendanceData.length > 0 ? Math.round((totalPresentDays / attendanceData.length) * 100) : 0


    // Paginate attendance data
    const startIndex = (currentPage - 1) * Number.parseInt(rowsPerPage)
    const endIndex = startIndex + Number.parseInt(rowsPerPage)
    const paginatedData = attendanceData.slice(startIndex, endIndex)
    const totalPages = Math.ceil(attendanceData.length / Number.parseInt(rowsPerPage))

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }


    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        }).format(date)
    }

    const months = [
        { value: "01", label: "January" },
        { value: "02", label: "February" },
        { value: "03", label: "March" },
        { value: "04", label: "April" },
        { value: "05", label: "May" },
        { value: "06", label: "June" },
        { value: "07", label: "July" },
        { value: "08", label: "August" },
        { value: "09", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ]

    const years = ["2023", "2024", "2025"]

    if (loading) {
        return (
            <div className="rounded-lg shadow-md bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="font-medium text-gray-700 py-3">Date</TableHead>
                            <TableHead className="font-medium text-gray-700 w-[120px] text-center py-3">Status</TableHead>
                            <TableHead className="font-medium text-gray-700 py-3">Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index} className="border-b border-gray-100">
                                <TableCell className="py-3">
                                    <Skeleton className="h-6 w-full" />
                                </TableCell>
                                <TableCell className="py-3">
                                    <Skeleton className="h-6 w-full" />
                                </TableCell>
                                <TableCell className="py-3">
                                    <Skeleton className="h-6 w-full" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    return (
        <div className="space-y-4 p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Attendance</h1>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div></div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3 md:justify-end">
                    <div className="w-full md:w-auto min-w-[150px]">
                        <label className="text-sm font-medium mb-1 block">Select Month</label>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month) => (
                                    <SelectItem key={month.value} value={month.value}>
                                        {month.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full md:w-auto min-w-[150px]">
                        <label className="text-sm font-medium mb-1 block">Select Year</label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {selectedStudent && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-2">
                        {students.find((s) => s.id === selectedStudent)?.name} - Attendance Summary
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <p className="text-sm text-green-700">Present Days</p>
                            <p className="text-2xl font-bold text-green-800">{totalPresentDays}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                            <p className="text-sm text-red-700">Absent Days</p>
                            <p className="text-2xl font-bold text-red-800">{totalAbsentDays}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-700">Attendance Rate</p>
                            <p className="text-2xl font-bold text-blue-800">{attendancePercentage}%</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="rounded-lg shadow-md bg-white overflow-hidden border border-gray-200">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="font-medium text-gray-700 py-3">Date</TableHead>
                            <TableHead className="font-medium text-gray-700 w-[120px] text-center py-3">Status</TableHead>
                            <TableHead className="font-medium text-gray-700 py-3">Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {selectedStudent ? (
                            paginatedData.length > 0 ? (
                                paginatedData.map((record) => (
                                    <TableRow key={record.id} className="hover:bg-gray-50 border-b border-gray-100">
                                        <TableCell className="font-medium py-3">{formatDate(record.date)}</TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex justify-center">
                        <span
                            className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium",
                                record.status
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200",
                            )}
                        >
                          {record.status ? "Present" : "Absent"}
                        </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="text-sm text-gray-600">{record.remarks || "No remarks"}</span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                                        No attendance records for this month.
                                    </TableCell>
                                </TableRow>
                            )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                                    No records were found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedStudent && attendanceData.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                    <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(endIndex, attendanceData.length)} of {attendanceData.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === currentPage ? "default" : "outline"}
                                    size="sm"
                                    className="w-9"
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
