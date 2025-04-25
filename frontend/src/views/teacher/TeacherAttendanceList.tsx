"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { PageHeader } from "@/components/ListPage/PageHeader"
import AxiosInstance from "@/auth/AxiosInstance"
import { toast } from "sonner"
import { PlusCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {TeacherAttendanceDataTable} from "@/views/teacher/TeacherAttendanceDatatable.tsx";

interface Student {
    id: string
    full_name: string
}

export interface AttendanceRecord {
    id: string
    session: string
    student: Student
    status: boolean
    remarks: string | null
    present_days: number
}

export default function TeacherAttendancePage() {
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const navigate = useNavigate()

    useEffect(() => {
        fetchAttendanceRecords()
    }, [selectedDate])

    const fetchAttendanceRecords = async () => {
        setLoading(true)
        try {
            const formattedDate = format(selectedDate, "yyyy-MM-dd")
            const url = `/api/academic/teacher-student-attendance-record/?selected_date=${formattedDate}`

            const response = await AxiosInstance.get(url)
            setAttendanceData(response.data)
        } catch (error) {
            console.error("Error fetching attendance records:", error)
            toast.error("Failed to load attendance records. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date)
        }
    }

    const handleStatusChange = async (id: string, newStatus: boolean) => {
        try {
            const record = attendanceData.find((r) => r.id === id)
            if (!record) return

            await AxiosInstance.post(`/api/academic/attendance-record-individual-update/`, {
                session: record.session,
                student: record.student.id,
                status: newStatus,
                remarks: record.remarks,
            })

            setAttendanceData((prev) => prev.map((record) => (record.id === id ? { ...record, status: newStatus } : record)))

            toast.success("Attendance status updated successfully")
        } catch (error) {
            console.error("Error updating attendance status:", error)
            toast.error("Failed to update attendance status")
        }
    }

    const handleRemarksChange = async (id: string, remarks: string) => {
        try {
            const record = attendanceData.find((r) => r.id === id)
            if (!record) return

            await AxiosInstance.post(`/api/academic/attendance-record-individual-update/`, {
                session: record.session,
                student: record.student.id,
                status: record.status,
                remarks,
            })

            setAttendanceData((prev) => prev.map((record) => (record.id === id ? { ...record, remarks } : record)))

            toast.success("Remarks updated successfully")
        } catch (error) {
            console.error("Error updating remarks:", error)
            toast.error("Failed to update remarks")
        }
    }

    const handleBulkUpdate = async (selectedIds: string[], status: boolean) => {
        try {
            // Prepare bulk update data
            const updatesData = selectedIds
                .map((id) => {
                    const record = attendanceData.find((r) => r.id === id)
                    if (!record) return null

                    return {
                        id: record.id,
                        session: record.session,
                        student: record.student.id,
                        status: status,
                        remarks: record.remarks,
                    }
                })
                .filter(Boolean)

            // Call API with all updates
            await AxiosInstance.put("/api/academic/attendance-record-update/", updatesData)

            // Update local state
            setAttendanceData((prev) =>
                prev.map((record) => (selectedIds.includes(record.id) ? { ...record, status } : record)),
            )

            toast.success(`${selectedIds.length} records updated successfully`)
        } catch (error) {
            console.error("Error updating attendance records:", error)
            toast.error("Failed to update attendance records")
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <PageHeader
                title="Teacher Attendance"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Teacher", href: "/teacher" },
                    { label: "Attendance", href: "/teacher/attendance" },
                ]}
                onRefresh={fetchAttendanceRecords}
                onPrint={() => console.log("Printing...")}
                onExport={() => console.log("Exporting...")}
                primaryAction={
                    attendanceData.length === 0
                        ? {
                            label: "Take Today's Attendance",
                            onClick: () => navigate("/attendance/session/create"),
                            icon: <PlusCircle className="h-4 w-4" />,
                        }
                        : {
                            label: "Attendance Already Taken",
                            className: "cursor-not-allowed disabled opacity-50",
                            onClick: () => navigate("/list/attendance"),
                            icon: <PlusCircle className="h-4 w-4" />,
                        }
                }
            />

            <TeacherAttendanceDataTable
                data={attendanceData}
                onStatusChange={handleStatusChange}
                onRemarksChange={handleRemarksChange}
                onBulkUpdate={handleBulkUpdate}
                loading={loading}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />
        </div>
    )
}
