"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { PageHeader } from "@/components/ListPage/PageHeader"
import AxiosInstance from "@/auth/AxiosInstance"
import { toast } from "sonner"
import TeacherAttendanceDataTable from "@/views/teacher/TeacherAttendanceDatatable.tsx";
import {PlusCircle} from "lucide-react";
import {useNavigate} from "react-router-dom";

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

export default function TeacherAttendanceListPage() {
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
            await AxiosInstance.patch(`/api/academic/attendance-record/${id}/`, {
                status: newStatus,
            })

            // Update local state
            setAttendanceData((prev) => prev.map((record) => (record.id === id ? { ...record, status: newStatus } : record)))

            toast.success("Attendance status updated successfully")
        } catch (error) {
            console.error("Error updating attendance status:", error)
            toast.error("Failed to update attendance status")
        }
    }

    const handleRemarksChange = async (id: string, remarks: string) => {
        try {
            await AxiosInstance.patch(`/api/academic/attendance-record/${id}/`, {
                remarks,
            })

            // Update local state
            setAttendanceData((prev) => prev.map((record) => (record.id === id ? { ...record, remarks } : record)))

            toast.success("Remarks updated successfully")
        } catch (error) {
            console.error("Error updating remarks:", error)
            toast.error("Failed to update remarks")
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            {
                attendanceData.length === 0 ? (
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
                        primaryAction={{
                            label: "Take Today's Attendance",
                            onClick: () => navigate("/attendance/session/create"),
                            icon: <PlusCircle className="h-4 w-4" />,
                        }}            />
                ): (
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
                        primaryAction={{
                            label: "Attendance Already Taken",
                            className: "cursor-not-allowed disabled opacity-50",
                            onClick: () => navigate("/list/attendance"),
                            icon: <PlusCircle className="h-4 w-4" />,
                        }}            />
                )
            }


            <TeacherAttendanceDataTable
                data={attendanceData}
                onStatusChange={handleStatusChange}
                onRemarksChange={handleRemarksChange}
                loading={loading}
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
            />
        </div>
    )
}
