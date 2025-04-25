"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Check, Search, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"
import { cn } from "@/lib/utils.ts"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar.tsx"

interface AttendanceRecord {
    id: string
    session: string
    student: {
        id: string
        full_name: string
    }
    status: boolean
    remarks: string | null
    present_days: number
}

interface ClassData {
    id: string
    name: string
    section: {
        id: string
        name: string
    }[]
    no_of_students: number
    no_of_subjects: number
    created_at: string
    updated_at: string
}

interface AttendanceDataTableProps {
    data: AttendanceRecord[]
    classData: ClassData[]
    availableSections: { id: string; name: string }[]
    onStatusChange: (id: string, status: boolean) => void
    onRemarksChange: (id: string, remarks: string) => void
    selectedDate: Date
    selectedClass: string
    selectedSection: string
    handleDateChange: (date: Date | undefined) => void
    handleClassChange: (classId: string) => void
    handleSectionChange: (sectionId: string) => void
    loading: boolean
}

export default function AttendanceDataTable({
                                                data,
                                                classData,
                                                availableSections,
                                                onRemarksChange,
                                                selectedDate,
                                                selectedClass,
                                                selectedSection,
                                                handleDateChange,
                                                handleClassChange,
                                                handleSectionChange,
                                                loading,
                                            }: AttendanceDataTableProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)
    const [editingRemarks, setEditingRemarks] = useState<string | null>(null)
    const [remarksValue, setRemarksValue] = useState("")

    // Filter data based on search query
    const filteredData = data.filter((record) =>
        record.student.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Paginate data
    const startIndex = (currentPage - 1) * Number.parseInt(rowsPerPage)
    const endIndex = startIndex + Number.parseInt(rowsPerPage)
    const paginatedData = filteredData.slice(startIndex, endIndex)
    const totalPages = Math.ceil(filteredData.length / Number.parseInt(rowsPerPage))

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
        setCurrentPage(1) // Reset to first page on search
    }

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(value)
        setCurrentPage(1) // Reset to first page when changing rows per page
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }


    const saveRemarks = (id: string) => {
        onRemarksChange(id, remarksValue)
        setEditingRemarks(null)
    }

    const cancelEditingRemarks = () => {
        setEditingRemarks(null)
    }

    if (loading) {
        return (
            <div className="rounded shadow-md bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-semibold">Student</TableHead>
                            <TableHead className="font-semibold w-[120px] text-center">Status</TableHead>
                            <TableHead className="font-semibold">Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Skeleton className="h-6 w-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-full" />
                                </TableCell>
                                <TableCell>
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
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rows Per Page</span>
                    <Select value={rowsPerPage} onValueChange={handleRowsPerPageChange}>
                        <SelectTrigger className="w-[80px] h-9">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by student name..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    <Select value={selectedClass} onValueChange={handleClassChange}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">--Select class--</SelectItem>
                            {classData.map((classItem) => (
                                <SelectItem key={classItem.id} value={classItem.id}>
                                    {classItem.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedSection}
                        onValueChange={handleSectionChange}
                        disabled={!selectedClass || availableSections.length === 0}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">--Select section</SelectItem>
                            {availableSections.map((section) => (
                                <SelectItem key={section.id} value={section.id}>
                                    {section.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="rounded shadow-md bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-semibold">Student</TableHead>
                            <TableHead className="font-semibold w-[120px] text-center">Status</TableHead>
                            <TableHead className="hidden md:table-cell font-semibold">Present Days</TableHead>
                            <TableHead className="font-semibold">Remarks</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((record) => (
                                <TableRow key={record.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">{record.student.full_name}</TableCell>
                                    <TableCell className="text-center">
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
                                    <TableCell className="hidden md:table-cell">{record.present_days}</TableCell>
                                    <TableCell>
                                        {editingRemarks === record.id ? (
                                            <div className="flex gap-2">
                                                <Textarea
                                                    value={remarksValue}
                                                    onChange={(e) => setRemarksValue(e.target.value)}
                                                    className="min-h-[60px] text-sm"
                                                    placeholder="Enter remarks..."
                                                />
                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => saveRemarks(record.id)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={cancelEditingRemarks} className="h-8 w-8">
                                                        <X className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">{record.remarks || "No remarks"}</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    {searchQuery
                                        ? "No matching students found."
                                        : selectedClass || selectedSection
                                            ? "No attendance records for the selected filters."
                                            : "No attendance records for this date."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {filteredData.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                    <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
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
