"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, PlusCircle, MoreHorizontal } from "lucide-react"
import { format, differenceInDays, addDays } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import axiosInstance from "@/auth/AxiosInstance.ts"

interface LeaveRequest {
    id: string
    start_date: string
    end_date: string
    leave_reason: string
    leave_status: "Pending" | "Approved" | "Rejected"
    created_at: string
}

export function StudentLeave() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [requestDialogOpen, setRequestDialogOpen] = useState(false)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)

    const leaveFormSchema = z
        .object({
            startDate: z.string({
                required_error: "Start date is required",
            }),
            endDate: z.string({
                required_error: "End date is required",
            }),
            reason: z
                .string({
                    required_error: "Reason is required",
                })
                .min(10, {
                    message: "Reason must be at least 10 characters",
                })
                .max(500, {
                    message: "Reason must not exceed 500 characters",
                }),
        })
        .refine(
            (data) => {
                const start = new Date(data.startDate)
                const end = new Date(data.endDate)
                return end >= start
            },
            {
                message: "End date must be after or equal to start date",
                path: ["endDate"],
            },
        )

    type LeaveFormValues = z.infer<typeof leaveFormSchema>

    const form = useForm<LeaveFormValues>({
        resolver: zodResolver(leaveFormSchema),
        defaultValues: {
            startDate: format(new Date(), "yyyy-MM-dd"),
            endDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
            reason: "",
        },
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return format(date, "MMMM dd, yyyy")
    }

    const calculateDays = (startDate: string, endDate: string) => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        return differenceInDays(end, start) + 1
    }

    const fetchLeaves = () => {
        axiosInstance
            .get("/api/auth/leave-me/")
            .then((res) => {
                setLeaveRequests(res.data)
            })
            .catch((err) => {
                console.error("Error fetching leave requests:", err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchLeaves()
    }, [])

    const handleRequestLeave = (values: LeaveFormValues) => {
        const requestData = {
            start_date: values.startDate,
            end_date: values.endDate,
            leave_reason: values.reason,
        }

        axiosInstance
            .post("/api/auth/leave-me/", requestData)
            .then(() => {
                fetchLeaves()
                setRequestDialogOpen(false)
                form.reset({
                    startDate: format(new Date(), "yyyy-MM-dd"),
                    endDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
                    reason: "",
                })
                toast.success("Leave request submitted successfully")
            })
            .catch((err) => {
                console.error("Error submitting leave request:", err)
                toast.error("Failed to submit leave request")
            })
    }

    const handleView = (id: string) => {
        const leave = leaveRequests.find((req) => req.id === id)
        if (leave) {
            setSelectedLeave(leave)
            setViewDialogOpen(true)
        }
    }

    const handleCancel = (id: string) => {
        axiosInstance
            .delete(`/api/auth/leave-me/${id}/`)
            .then(() => {
                fetchLeaves()
                toast.success("Leave request cancelled successfully")
            })
            .catch((err) => {
                console.error("Error cancelling leave request:", err)
                toast.error("Failed to cancel leave request")
            })
    }

    const approvedLeaves = leaveRequests
        .filter((leave) => leave.leave_status?.toLowerCase() === "approved")
        .reduce((total, leave) => total + calculateDays(leave.start_date, leave.end_date), 0)
    const rejectedLeaves = leaveRequests
        .filter((leave) => leave.leave_status?.toLowerCase() === "rejected")
        .reduce((total, leave) => total + calculateDays(leave.start_date, leave.end_date), 0)
    const pendingRequests = leaveRequests.filter((leave) => leave.leave_status?.toLowerCase() === "pending").length

    const getStatusBadge = (status: string) => {
        const normalizedStatus = status?.toLowerCase().trim()

        switch (normalizedStatus) {
            case "pending":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                    </Badge>
                )
            case "approved":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <XCircle className="h-3 w-3 mr-1" />
                        Rejected
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {status || "Unknown"}
                    </Badge>
                )
        }
    }

    return (
        <div className="p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Leave Management</h1>
                    <p className="text-gray-500">View and request leaves</p>
                </div>
                <Button onClick={() => setRequestDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Request Leave
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-yellow-50 p-2 rounded-md">
                            <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Pending Requests</h3>
                            <p className="text-sm text-gray-500 mt-1">{pendingRequests} requests awaiting review</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-green-50 p-2 rounded-md">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Approved Days</h3>
                            <p className="text-sm text-gray-500 mt-1">{approvedLeaves} days approved</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-red-50 p-2 rounded-md">
                            <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Rejected Days</h3>
                            <p className="text-sm text-gray-500 mt-1">{rejectedLeaves} days rejected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leave History Table */}
            <Card className="bg-white border border-gray-200">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Applied On</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Days</TableHead>
                                <TableHead className="hidden md:table-cell">Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 4 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton className="h-5 w-28" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-28" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-28" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-10" />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Skeleton className="h-5 w-40" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-20" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-10" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : leaveRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                        No leave requests found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leaveRequests.map((leave) => (
                                    <TableRow key={leave.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-gray-500" />
                                                <span>{formatDate(leave.created_at)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(leave.start_date)}</TableCell>
                                        <TableCell>{formatDate(leave.end_date)}</TableCell>
                                        <TableCell>{calculateDays(leave.start_date, leave.end_date)} days</TableCell>
                                        <TableCell className="hidden md:table-cell max-w-[200px] truncate" title={leave.leave_reason}>
                                            {leave.leave_reason}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(leave.leave_status)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleView(leave.id)}>View</DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleCancel(leave.id)}
                                                        disabled={leave.leave_status !== "Pending"}
                                                    >
                                                        Cancel
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Request Leave Dialog */}
            <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Request Leave</DialogTitle>
                        <DialogDescription>Fill in the details to submit a leave request</DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRequestLeave)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reason for Leave</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Please provide a detailed reason for your leave request"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Your request will be reviewed by the class teacher and administration.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={() => setRequestDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Submit Request</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* View Leave Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Leave Request Details</DialogTitle>
                        <DialogDescription>View the details of your leave request</DialogDescription>
                    </DialogHeader>

                    {selectedLeave && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                                    <p className="text-sm text-gray-900 mt-1">{formatDate(selectedLeave.start_date)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">End Date</label>
                                    <p className="text-sm text-gray-900 mt-1">{formatDate(selectedLeave.end_date)}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Duration</label>
                                <p className="text-sm text-gray-900 mt-1">
                                    {calculateDays(selectedLeave.start_date, selectedLeave.end_date)} days
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Status</label>
                                <div className="mt-1">{getStatusBadge(selectedLeave.leave_status)}</div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Applied On</label>
                                <p className="text-sm text-gray-900 mt-1">{formatDate(selectedLeave.created_at)}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Reason</label>
                                <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">{selectedLeave.leave_reason}</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
