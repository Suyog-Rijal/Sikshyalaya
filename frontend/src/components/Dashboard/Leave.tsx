"use client"

import { useState, useEffect } from "react"
import { format, differenceInDays } from "date-fns"
import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import { FilterBar } from "@/components/ListPage/FilterBar.tsx"
import { Eye, CheckCircle, XCircle, Calendar, Clock, User } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface LeaveRequest {
    id: string
    student: string
    leave_reason: string
    start_date: string
    end_date: string
    leave_status: "pending" | "approved" | "rejected"
    created_at: string
}

export function LeavePage() {
    const sortOptions = [
        { label: "Newest First", value: "created_desc" },
        { label: "Oldest First", value: "created_asc" },
        { label: "Start Date (Earliest)", value: "start_asc" },
        { label: "Start Date (Latest)", value: "start_desc" },
        { label: "Student Name A-Z", value: "student_asc" },
        { label: "Student Name Z-A", value: "student_desc" },
    ]

    const filterOptions = [
        { label: "All Requests", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
    ]

    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [sortOrder, setSortOrder] = useState("created_desc")
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return format(date, "MMMM dd, yyyy")
    }

    const calculateDays = (startDate: string, endDate: string) => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        return differenceInDays(end, start) + 1 // Include both start and end days
    }

    useEffect(() => {
        // Simulate API call to fetch leave requests
        setTimeout(() => {
            const mockLeaveRequests: LeaveRequest[] = [
                {
                    id: "1",
                    student: "John Smith",
                    leave_reason: "Family emergency - need to travel home for a week",
                    start_date: "2024-05-15",
                    end_date: "2024-05-22",
                    leave_status: "pending",
                    created_at: "2024-05-10T09:30:00",
                },
                {
                    id: "345",
                    student: "Test Copeland",
                    leave_reason: "Test leave",
                    start_date: "2024-05-01",
                    end_date: "2024-05-06",
                    leave_status: "pending",
                    created_at: "2024-05-10T09:30:00",
                },
                {
                    id: "2",
                    student: "Emma Johnson",
                    leave_reason: "Medical appointment and recovery",
                    start_date: "2024-05-18",
                    end_date: "2024-05-19",
                    leave_status: "approved",
                    created_at: "2024-05-08T14:15:00",
                },
                {
                    id: "3",
                    student: "Michael Brown",
                    leave_reason: "Participating in national debate competition",
                    start_date: "2024-06-01",
                    end_date: "2024-06-05",
                    leave_status: "approved",
                    created_at: "2024-05-12T11:45:00",
                },
                {
                    id: "4",
                    student: "Sophia Garcia",
                    leave_reason: "Religious holiday observance",
                    start_date: "2024-05-25",
                    end_date: "2024-05-25",
                    leave_status: "pending",
                    created_at: "2024-05-11T10:20:00",
                },
                {
                    id: "5",
                    student: "William Davis",
                    leave_reason: "Severe flu - doctor recommended rest",
                    start_date: "2024-05-14",
                    end_date: "2024-05-17",
                    leave_status: "rejected",
                    created_at: "2024-05-13T08:50:00",
                },
                {
                    id: "6",
                    student: "Olivia Wilson",
                    leave_reason: "Family wedding",
                    start_date: "2024-05-28",
                    end_date: "2024-05-30",
                    leave_status: "pending",
                    created_at: "2024-05-09T16:05:00",
                },
                {
                    id: "7",
                    student: "James Martinez",
                    leave_reason: "Dental surgery and recovery",
                    start_date: "2024-05-20",
                    end_date: "2024-05-21",
                    leave_status: "approved",
                    created_at: "2024-05-07T13:40:00",
                },
                {
                    id: "8",
                    student: "Ava Anderson",
                    leave_reason: "Representing school in sports tournament",
                    start_date: "2024-06-10",
                    end_date: "2024-06-15",
                    leave_status: "pending",
                    created_at: "2024-05-14T09:10:00",
                },
            ]

            setLeaveRequests(mockLeaveRequests)
            setLoading(false)
        }, 1500)
    }, [])

    const handleViewDetails = (leave: LeaveRequest) => {
        setSelectedLeave(leave)
        setViewDetailsOpen(true)
    }

    const handleStatusChange = (status: "approved" | "rejected") => {
        if (!selectedLeave) return

        // In a real app, this would call an API to update the leave status
        setLeaveRequests((prev) =>
            prev.map((leave) => (leave.id === selectedLeave.id ? { ...leave, leave_status: status } : leave)),
        )

        setViewDetailsOpen(false)
        toast.success(`Leave request ${status === "approved" ? "approved" : "rejected"} successfully`)
    }

    // Filtering logic
    const filteredLeaves = leaveRequests.filter((leave) => {
        const searchMatch =
            leave.student.toLowerCase().includes(searchText.toLowerCase()) ||
            leave.leave_reason.toLowerCase().includes(searchText.toLowerCase())

        let statusMatch = true
        if (filterStatus !== "all") {
            statusMatch = leave.leave_status === filterStatus
        }

        return searchMatch && statusMatch
    })

    // Sorting logic
    const sortedLeaves = [...filteredLeaves].sort((a, b) => {
        if (sortOrder === "created_desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        if (sortOrder === "created_asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        if (sortOrder === "start_asc") return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        if (sortOrder === "start_desc") return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        if (sortOrder === "student_asc") return a.student.localeCompare(b.student)
        if (sortOrder === "student_desc") return b.student.localeCompare(a.student)
        return 0
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pending
                    </Badge>
                )
            case "approved":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Approved
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Rejected
                    </Badge>
                )
            default:
                return null
        }
    }

    // Summary counts
    const pendingCount = leaveRequests.filter((leave) => leave.leave_status === "pending").length
    const approvedCount = leaveRequests.filter((leave) => leave.leave_status === "approved").length
    const rejectedCount = leaveRequests.filter((leave) => leave.leave_status === "rejected").length

    return (
        <div className="p-4 flex flex-col gap-4 bg-gray-50">
            <div>
                <PageHeader
                    title="Leave Requests"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/" },
                        { label: "Students", href: "/students/" },
                        { label: "Leave Requests", href: "/students/leave/" },
                    ]}
                />
                <FilterBar
                    title="Student Leave Management"
                    onSortChange={(sort) => setSortOrder(sort)}
                    onFilterChange={(filter) => setFilterStatus(filter)}
                    onSearchChange={(text) => setSearchText(text)}
                    sortOptions={sortOptions}
                    filterOptions={filterOptions}
                />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-yellow-50 p-2 rounded-md">
                            <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Pending Requests</h3>
                            <p className="text-sm text-gray-500 mt-1">{pendingCount} requests awaiting review</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-green-50 p-2 rounded-md">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Approved Leaves</h3>
                            <p className="text-sm text-gray-500 mt-1">{approvedCount} requests approved</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-red-50 p-2 rounded-md">
                            <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Rejected Leaves</h3>
                            <p className="text-sm text-gray-500 mt-1">{rejectedCount} requests rejected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leave Requests Table */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="hidden md:table-cell">Duration</TableHead>
                            <TableHead className="hidden lg:table-cell">Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-5 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-48" />
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Skeleton className="h-5 w-20" />
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <Skeleton className="h-5 w-36" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-20" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-9 w-20 ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : sortedLeaves.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No leave requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedLeaves.map((leave) => (
                                <TableRow key={leave.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">{leave.student}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-xs truncate" title={leave.leave_reason}>
                                            {leave.leave_reason}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {calculateDays(leave.start_date, leave.end_date)} day(s)
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                            <span>
                        {formatDate(leave.start_date)}
                                                {leave.start_date !== leave.end_date && ` - ${formatDate(leave.end_date)}`}
                      </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(leave.leave_status)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(leave)}
                                            className="flex items-center gap-1"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>View</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* View Details Dialog */}
            <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Leave Request Details</DialogTitle>
                        <DialogDescription>Review the leave request details and take action.</DialogDescription>
                    </DialogHeader>

                    {selectedLeave && (
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Student</h4>
                                    <p className="mt-1">{selectedLeave.student}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                    <div className="mt-1">{getStatusBadge(selectedLeave.leave_status)}</div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Leave Duration</h4>
                                <p className="mt-1">
                                    {formatDate(selectedLeave.start_date)}
                                    {selectedLeave.start_date !== selectedLeave.end_date && ` to ${formatDate(selectedLeave.end_date)}`}
                                    <span className="ml-2 text-gray-500">
                    ({calculateDays(selectedLeave.start_date, selectedLeave.end_date)} day(s))
                  </span>
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Reason for Leave</h4>
                                <p className="mt-1">{selectedLeave.leave_reason}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Request Submitted</h4>
                                <p className="mt-1">{format(new Date(selectedLeave.created_at), "MMMM dd, yyyy 'at' h:mm a")}</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        {selectedLeave?.leave_status === "pending" && (
                            <>
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                    onClick={() => handleStatusChange("rejected")}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject Leave
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange("approved")}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve Leave
                                </Button>
                            </>
                        )}
                        {selectedLeave?.leave_status !== "pending" && (
                            <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
                                Close
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
