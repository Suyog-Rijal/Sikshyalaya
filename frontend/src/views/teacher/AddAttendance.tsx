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
import { Check, Pencil, Search, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { z } from "zod"
import {Link} from "react-router-dom";

interface Student {
    id: string
    session: string
    student: {
        id: string
        full_name: string
    }
    status: boolean | null
    remarks: string | null
    present_days: number
}

const attendanceSchema = z.object({
    students: z.array(
        z.object({
            id: z.string(),
            status: z.boolean({
                required_error: "Attendance status is required",
                invalid_type_error: "Attendance status must be selected",
            }),
        }),
    ),
})

export default function AttendancePage() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [selectedDate] = useState<Date>(new Date())
    const [searchQuery, setSearchQuery] = useState("")
    const [editingRemarks, setEditingRemarks] = useState<string | null>(null)
    const [remarksValue, setRemarksValue] = useState("")
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [validationError, setValidationError] = useState<string | null>(null)

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        setLoading(true)
        try {
            const sessionResponse = await AxiosInstance.post("/api/academic/attendance-session/")
            const session = sessionResponse.data?.session_id
            setSessionId(session)

            const detailsResponse = await AxiosInstance.get(`/api/academic/attendance-session-detail/${session}/`)

            const studentsWithNullStatus = (detailsResponse.data || []).map((student: any) => ({
                ...student,
                status: null,
            }))

            setStudents(studentsWithNullStatus)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = (id: string, status: boolean) => {
        setStudents((prev) => prev.map((student) => (student.id === id ? { ...student, status } : student)))
        // Clear validation error when user makes a selection
        setValidationError(null)
    }

    const handleRemarksChange = (id: string, remarks: string) => {
        setStudents((prev) => prev.map((student) => (student.id === id ? { ...student, remarks } : student)))
    }

    const handleSaveAttendance = async () => {
        try {
            attendanceSchema.parse({
                students: students.map((student) => ({
                    id: student.id,
                    status: student.status,
                })),
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                const missingCount = students.filter((student) => student.status === null).length
                setValidationError(
                    `Please mark attendance for all students. ${missingCount} student(s) still need attendance marked.`,
                )
                toast.error(`Please mark attendance for all students. ${missingCount} student(s) still need attendance marked.`)
                return
            }
        }

        if (!sessionId) {
            toast.error("No active session found")
            return
        }

        setSaving(true)
        try {
            const attendanceData = students.map((student) => ({
                id: student.id,
                session: student.session,
                student: student.student.id,
                status: student.status,
                remarks: student.remarks,
            }))

            console.log(attendanceData)
            await AxiosInstance.put(`/api/academic/attendance-record-update/`, attendanceData)
            toast.success("Attendance saved successfully")
            setValidationError(null)
        } catch (error) {
            console.error("Error saving attendance:", error)
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

    const filteredStudents = students.filter(
        (student) =>
            student.student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.student.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="p-4 flex flex-col gap-4">
            {/* Breadcrumb navigation */}


            <h1 className="text-2xl font-bold">Take Attendance</h1>

            <div className="flex items-center text-sm mb-6">
                <Link to={'/'} className="text-slate-500 hover:text-slate-700">
                    Dashboard
                </Link>

                <span className="mx-2 text-gray-400">/</span>


                <Link to={'/list/attendance'} className="text-slate-500 hover:text-slate-700">
                    Attendance
                </Link>

                <span className="mx-2 text-gray-400">/</span>

                <span className="text-slate-700 cursor-pointer">
                    Session
                </span>

            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="text-sm">
                    Date: <span className="font-medium">{format(selectedDate, "PPP")}</span>
                </div>
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        type="search"
                        placeholder="Search by ID or name..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {validationError && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r mb-4">
                    {validationError}
                </div>
            )}

            <div className="rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="font-semibold w-[100px]">Student ID</TableHead>
                                <TableHead className="font-semibold">Name</TableHead>
                                <TableHead className="font-semibold w-[120px] text-center">Attendance</TableHead>
                                <TableHead className="font-semibold">Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({length: 5}).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-6 w-full"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-full"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-full"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-full"/>
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
                                <TableHead className="font-semibold w-[120px] text-center">Attendance</TableHead>
                                <TableHead className="font-semibold">Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <TableRow key={student.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-sm">{student.student.id}</TableCell>
                                        <TableCell className="text-sm">{student.student.full_name}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleStatusChange(student.id, true)}
                                                    className={cn(
                                                        "w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer",
                                                        student.status === true ? "bg-green-200 text-green-800" : "text-gray-400 hover:bg-gray-100",
                                                    )}
                                                    aria-label="Mark as present"
                                                >
                                                    <Check className="h-4 w-4"/>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(student.id, false)}
                                                    className={cn(
                                                        "w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer",
                                                        student.status === false ? "bg-red-200 text-red-800" : "text-gray-400 hover:bg-gray-100",
                                                    )}
                                                    aria-label="Mark as absent"
                                                >
                                                    <X className="h-4 w-4"/>
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {editingRemarks === student.id ? (
                                                <div className="flex bg-yellow-500 gap-2">
                                                    <div className="w-96 bg-pink-500 h-[60px]">
                                                        <Textarea
                                                            value={remarksValue}
                                                            onChange={(e) => setRemarksValue(e.target.value)}
                                                            className="h-full text-sm resize-none"
                                                            placeholder="Enter remarks..."
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            onClick={() => saveRemarks(student.id)}
                                                            className="h-8 w-8 flex items-center justify-center text-green-600 hover:text-green-700 cursor-pointer"
                                                        >
                                                            <Check className="h-4 w-4"/>
                                                        </button>
                                                        <button
                                                            onClick={cancelEditingRemarks}
                                                            className="h-8 w-8 flex items-center justify-center text-red-600 hover:text-red-700 cursor-pointer"
                                                        >
                                                            <X className="h-4 w-4"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between min-h-[24px]">
                                                    <span
                                                        className="text-sm text-gray-600">{student.remarks || "No remarks"}</span>
                                                    <button
                                                        onClick={() => startEditingRemarks(student.id, student.remarks)}
                                                        className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5"/>
                                                    </button>
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

            {/* Save button at the bottom */}
            <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveAttendance} disabled={saving || loading} size="lg"
                        className="px-8 cursor-pointer">
                    {saving ? "Saving..." : "Save Attendance"}
                </Button>
            </div>
        </div>
    )
}
