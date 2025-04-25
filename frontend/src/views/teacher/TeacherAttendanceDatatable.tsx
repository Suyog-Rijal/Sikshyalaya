"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, MoreHorizontal, Search, Pencil } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {AttendanceRecord} from "@/views/teacher/TeacherAttendanceList.tsx";

interface TeacherAttendanceDataTableProps {
    data: AttendanceRecord[]
    onStatusChange: (id: string, status: boolean) => void
    onRemarksChange: (id: string, remarks: string) => void
    onBulkUpdate: (selectedIds: string[], status: boolean) => void
    selectedDate: Date
    onDateChange: (date: Date | undefined) => void
    loading: boolean
}

export function TeacherAttendanceDataTable({
                                               data,
                                               onStatusChange,
                                               onRemarksChange,
                                               onBulkUpdate,
                                               selectedDate,
                                               onDateChange,
                                               loading,
                                           }: TeacherAttendanceDataTableProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)
    const [editingRemarks, setEditingRemarks] = useState<string | null>(null)
    const [remarksValue, setRemarksValue] = useState("")
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [selectedAction, setSelectedAction] = useState<string>("none")

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

    const startEditingRemarks = (id: string, currentRemarks: string | null) => {
        setEditingRemarks(id)
        setRemarksValue(currentRemarks || "")
    }

    const saveRemarks = (id: string) => {
        onRemarksChange(id, remarksValue)
        setEditingRemarks(null)
    }

    const handleRowSelection = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedRows((prev) => [...prev, id])
        } else {
            setSelectedRows((prev) => prev.filter((rowId) => rowId !== id))
        }
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(paginatedData.map((record) => record.id))
        } else {
            setSelectedRows([])
        }
    }

    const handleBulkSelectedAction = () => {
        if (selectedRows.length === 0 || selectedAction === "none") {
            return
        }

        onBulkUpdate(selectedRows, selectedAction === "present")

        // Clear selection after action
        setSelectedRows([])
        setSelectedAction("none")
    }

    if (loading) {
        return (
            <div className="rounded-lg shadow-md bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="w-[40px] py-3">
                                <Checkbox disabled />
                            </TableHead>
                            <TableHead className="font-medium text-gray-700 py-3">Student</TableHead>
                            <TableHead className="font-medium text-gray-700 w-[120px] text-center py-3">Status</TableHead>
                            <TableHead className="font-medium text-gray-700 py-3">Remarks</TableHead>
                            <TableHead className="font-medium text-gray-700 w-[80px] text-center py-3">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index} className="border-b border-gray-100">
                                <TableCell className="py-3">
                                    <Skeleton className="h-4 w-4" />
                                </TableCell>
                                <TableCell className="py-3">
                                    <Skeleton className="h-6 w-full" />
                                </TableCell>
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
                    {selectedRows.length > 0 && (
                        <div className="flex items-center gap-2 mr-2">
                            <span className="text-sm font-medium">{selectedRows.length} selected</span>
                            <Select value={selectedAction} onValueChange={setSelectedAction}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Choose action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Choose action</SelectItem>
                                    <SelectItem value="present">Mark Present</SelectItem>
                                    <SelectItem value="absent">Mark Absent</SelectItem>
                                </SelectContent>
                            </Select>
                            {selectedAction !== "none" && (
                                <Button size="sm" onClick={handleBulkSelectedAction}>
                                    Save
                                </Button>
                            )}
                        </div>
                    )}

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

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={selectedDate} onSelect={onDateChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="rounded-lg shadow-md bg-white overflow-hidden border border-gray-200">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="w-[40px] py-3">
                                <Checkbox
                                    checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all"
                                />
                            </TableHead>
                            <TableHead className="font-medium text-gray-700 py-3">Student</TableHead>
                            <TableHead className="font-medium text-gray-700 w-[120px] text-center py-3">Status</TableHead>
                            <TableHead className="font-medium text-gray-700 py-3">Remarks</TableHead>
                            <TableHead className="font-medium text-gray-700 w-[80px] text-center py-3">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((record) => (
                                <TableRow key={record.id} className="hover:bg-gray-50 border-b border-gray-100">
                                    <TableCell className="py-3">
                                        <Checkbox
                                            checked={selectedRows.includes(record.id)}
                                            onCheckedChange={(checked) => handleRowSelection(record.id, checked === true)}
                                            aria-label={`Select ${record.student.full_name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium py-3">{record.student.full_name}</TableCell>
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
                                        {editingRemarks === record.id ? (
                                            <div className="w-full">
                                                <Textarea
                                                    value={remarksValue}
                                                    onChange={(e) => setRemarksValue(e.target.value)}
                                                    onBlur={() => saveRemarks(record.id)}
                                                    autoFocus
                                                    className="min-h-[60px] text-sm resize-none"
                                                    placeholder="Enter remarks..."
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">{record.remarks || "No remarks"}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 ml-2"
                                                    onClick={() => startEditingRemarks(record.id, record.remarks)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5 text-gray-500" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => onStatusChange(record.id, true)} className="text-green-700">
                                                    Mark as Present
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onStatusChange(record.id, false)} className="text-red-700">
                                                    Mark as Absent
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => startEditingRemarks(record.id, record.remarks)}>
                                                    Edit Remarks
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    {searchQuery ? "No matching students found." : "No attendance records for this date."}
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
