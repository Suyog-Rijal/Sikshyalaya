"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import AxiosInstance from "@/auth/AxiosInstance"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Check, Search, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface Student {
    id: string
    full_name: string
    attendance_status: boolean | null
    remarks: string | null
}

export default function AddAttendancePage() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [selectedDate] = useState<Date>(new Date())
    const [searchQuery, setSearchQuery] = useState("")
    const [editingRemarks, setEditingRemarks] = useState<string | null>(null)
    const [remarksValue, setRemarksValue] = useState("")

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        setLoading(true)
        try {
            const response = await AxiosInstance.get("/api/academic/students/")

            // Initialize attendance status as null for all students
            const studentsWithAttendance = response.data.map((student) => ({
                ...student,
                attendance_status: null,
                remarks: null,
            }))

            setStudents(studentsWithAttendance)
        } catch (error) {
            console.error("Error fetching students:", error)
            toast.error("Failed to load students. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = (id: string, status: boolean) => {
        setStudents((prev) =>
            prev.map((student) => (student.id === id ? { ...student, attendance_status: status } : student)),
        )
    }

    const handleRemarksChange = (id: string, remarks: string) => {
        setStudents((prev) => prev.map((student) => (student.id === id ? { ...student, remarks } : student)))
    }

    const handleSaveAttendance = async () => {
        // Check if any student doesn't have attendance status set
        const incompleteRecords = students.filter((student) => student.attendance_status === null)

        if (incompleteRecords.length > 0) {
            toast.warning(
                `${incompleteRecords.length} students don't have attendance status marked. Please complete all records.`,
            )
            return
        }

        setSaving(true)
        try {
            const formattedDate = format(selectedDate, "yyyy-MM-dd")

            // Prepare attendance records
            const attendanceRecords = students.map((student) => ({
                student_id: student.id,
                status: student.attendance_status,
                remarks: student.remarks,
                date: formattedDate,
            }))

            await AxiosInstance.post("/api/academic/attendance-record/bulk-create/", {
                records: attendanceRecords,
            })

            toast.success("Attendance records saved successfully")

            // Reset the form after successful save
            const resetStudents = students.map((student) => ({
                ...student,
                attendance_status: null,
                remarks: null,
            }))
            setStudents(resetStudents)
        } catch (error) {
            console.error("Error saving attendance records:", error)
            toast.error("Failed to save attendance records. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    const startEditingRemarks = (id: string, currentRemarks: string | null) => {
        setEditingRemarks(id)
        setRemarksValue(currentRemarks || "")
    }

    const saveRemarks = (id: string) => {
        handleRemarksChange(id, remarksValue)
        setEditingRemarks(null)
    }

    const cancelEditingRemarks = () => {
        setEditingRemarks(null)
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
    }

    // Filter data based on search query
    const filteredStudents = students.filter(
        (student) =>
            student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Add Attendance</h1>
                <Button onClick={handleSaveAttendance} disabled={saving}>
                    {saving ? "Saving..." : "Save Attendance"}
                </Button>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="text-sm">
                    Date: <span className="font-medium">{format(selectedDate, "PPP")}</span>
                </div>
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by ID or name..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="rounded shadow-md bg-white overflow-hidden">
                {loading ? (
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="font-semibold w-[100px]">Student ID</TableHead>
                                <TableHead className="font-semibold">Name</TableHead>
                                <TableHead className="font-semibold w-[150px] text-center">Attendance Status</TableHead>
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
                ) : (
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="font-semibold w-[100px]">Student ID</TableHead>
                                <TableHead className="font-semibold">Name</TableHead>
                                <TableHead className="font-semibold w-[150px] text-center">Attendance Status</TableHead>
                                <TableHead className="font-semibold">Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <TableRow key={student.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{student.id}</TableCell>
                                        <TableCell>{student.full_name}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant={student.attendance_status === true ? "default" : "outline"}
                                                    className={cn(
                                                        "h-9 w-9 rounded-full",
                                                        student.attendance_status === true
                                                            ? "bg-green-500 hover:bg-green-600"
                                                            : "border-green-200 text-green-700 hover:bg-green-50",
                                                    )}
                                                    onClick={() => handleStatusChange(student.id, true)}
                                                    aria-label="Mark as present"
                                                >
                                                    <Check className="h-5 w-5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant={student.attendance_status === false ? "default" : "outline"}
                                                    className={cn(
                                                        "h-9 w-9 rounded-full",
                                                        student.attendance_status === false
                                                            ? "bg-red-500 hover:bg-red-600"
                                                            : "border-red-200 text-red-700 hover:bg-red-50",
                                                    )}
                                                    onClick={() => handleStatusChange(student.id, false)}
                                                    aria-label="Mark as absent"
                                                >
                                                    <X className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {editingRemarks === student.id ? (
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
                                                            onClick={() => saveRemarks(student.id)}
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
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">{student.remarks || "No remarks"}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => startEditingRemarks(student.id, student.remarks)}
                                                        className="h-8 px-2"
                                                    >
                                                        Edit
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        {searchQuery ? "No matching students found." : "No students available."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}
