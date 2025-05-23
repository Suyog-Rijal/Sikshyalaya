"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import { toast } from "sonner"
import AttendanceDataTable from "@/components/Table/AttendanceDataTable.tsx"

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

export default function AttendanceListPage() {
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
    const [classData, setClassData] = useState<ClassData[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedClass, setSelectedClass] = useState<string>("")
    const [selectedSection, setSelectedSection] = useState<string>("")
    const [availableSections, setAvailableSections] = useState<{ id: string; name: string }[]>([])

    useEffect(() => {
        fetchClassData()
    }, [])

    useEffect(() => {
        if (selectedClass) {
            const selectedClassData = classData.find((c) => c.id === selectedClass)
            setAvailableSections(selectedClassData?.section || [])
            setSelectedSection("")
        } else {
            setAvailableSections([])
            setSelectedSection("")
        }
    }, [selectedClass, classData])

    useEffect(() => {
        fetchAttendanceRecords()
    }, [selectedDate, selectedClass, selectedSection])

    const fetchClassData = async () => {
        try {
            const response = await AxiosInstance.get("/api/academic/class/")
            setClassData(response.data)
        } catch (error) {
            console.error("Error fetching class data:", error)
            toast.error("Failed to load class data. Please try again.")
        }
    }

    const fetchAttendanceRecords = async () => {
        setLoading(true)
        try {
            const formattedDate = format(selectedDate, "yyyy-MM-dd")
            let url = `/api/academic/attendance-record/?selected_date=${formattedDate}`

            if (selectedClass) {
                url += `&selected_class=${selectedClass}`
            }

            if (selectedSection) {
                url += `&selected_section=${selectedSection}`
            }

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

    const handleClassChange = (classId: string) => {
        setSelectedClass(classId)
    }

    const handleSectionChange = (sectionId: string) => {
        setSelectedSection(sectionId)
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
            <PageHeader
                title="Attendance"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Attendance", href: "/attendance/list/" },
                ]}
                onRefresh={fetchAttendanceRecords}
                onPrint={() => console.log("Printing...")}
                onExport={() => console.log("Exporting...")}
            />

            <AttendanceDataTable
                data={attendanceData}
                classData={classData}
                availableSections={availableSections}
                onStatusChange={handleStatusChange}
                onRemarksChange={handleRemarksChange}
                loading={loading}
                selectedDate={selectedDate}
                selectedClass={selectedClass}
                selectedSection={selectedSection}
                handleDateChange={handleDateChange}
                handleClassChange={handleClassChange}
                handleSectionChange={handleSectionChange}
            />
        </div>
    )
}
