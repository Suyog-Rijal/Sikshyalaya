"use client"

import { useState, useEffect } from "react"
import { Calendar, CheckCircle, XCircle, Clock, PlusCircle, CalendarDays } from "lucide-react"
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
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface LeaveRequest {
    id: string
    startDate: string
    endDate: string
    days: number
    reason: string
    status: "Pending" | "Approved" | "Rejected"
    appliedOn: string
    responseDate?: string
    responseComment?: string
}

export function StudentLeave() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [requestDialogOpen, setRequestDialogOpen] = useState(false)

    // Define the form schema
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

    useEffect(() => {
        // Simulate API call to fetch leave requests
        setTimeout(() => {
            const mockLeaveRequests: LeaveRequest[] = [
                {
                    id: "1",
                    startDate: "2024-04-10",
                    endDate: "2024-04-12",
                    days: 3,
                    reason: "Family function",
                    status: "Approved",
                    appliedOn: "2024-04-05",
                    responseDate: "2024-04-07",
                    responseComment: "Approved as requested",
                },
                {
                    id: "2",
                    startDate: "2024-03-15",
                    endDate: "2024-03-16",
                    days: 2,
                    reason: "Medical appointment",
                    status: "Approved",
                    appliedOn: "2024-03-10",
                    responseDate: "2024-03-12",
                },
                {
                    id: "3",
                    startDate: "2024-02-20",
                    endDate: "2024-02-22",
                    days: 3,
                    reason: "Personal emergency",
                    status: "Rejected",
                    appliedOn: "2024-02-18",
                    responseDate: "2024-02-19",
                    responseComment: "Insufficient notice period",
                },
                {
                    id: "4",
                    startDate: "2024-05-25",
                    endDate: "2024-05-27",
                    days: 3,
                    reason: "Family trip",
                    status: "Pending",
                    appliedOn: "2024-05-15",
                },
            ]

            setLeaveRequests(mockLeaveRequests)
            setLoading(false)
        }, 1500)
    }, [])

    const handleRequestLeave = (values: LeaveFormValues) => {
        const startDate = new Date(values.startDate)
        const endDate = new Date(values.endDate)
        const days = differenceInDays(endDate, startDate) + 1

        // Create new leave request
        const newLeaveRequest: LeaveRequest = {
            id: `new-${Date.now()}`,
            startDate: values.startDate,
            endDate: values.endDate,
            days,
            reason: values.reason,
            status: "Pending",
            appliedOn: format(new Date(), "yyyy-MM-dd"),
        }

        // Add to leave requests
        setLeaveRequests((prev) => [newLeaveRequest, ...prev])
        setRequestDialogOpen(false)
        form.reset({
            startDate: format(new Date(), "yyyy-MM-dd"),
            endDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
            reason: "",
        })
        toast.success("Leave request submitted successfully")
    }

    // Calculate leave statistics
    const totalLeaves = leaveRequests.reduce((total, leave) => total + leave.days, 0)
    const approvedLeaves = leaveRequests
        .filter((leave) => leave.status === "Approved")
        .reduce((total, leave) => total + leave.days, 0)
    const rejectedLeaves = leaveRequests
        .filter((leave) => leave.status === "Rejected")
        .reduce((total, leave) => total + leave.days, 0)
    const pendingLeaves = leaveRequests
        .filter((leave) => leave.status === "Pending")
        .reduce((total, leave) => total + leave.days, 0)

    // Assuming a student has 15 leave days per year
    const totalAllowedLeaves = 15
    const remainingLeaves = totalAllowedLeaves - approvedLeaves - pendingLeaves

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Pending":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Pending
                    </Badge>
                )
            case "Approved":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Approved
                    </Badge>
                )
            case "Rejected":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Rejected
                    </Badge>
                )
            default:
                return null
        }
    }

    return (
        <div className="p-6 bg-gray-50">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-full">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Total Leaves</h3>
                                <p className="text-2xl font-semibold text-gray-800 mt-1">{totalLeaves} days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-green-50 p-3 rounded-full">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Approved</h3>
                                <p className="text-2xl font-semibold text-gray-800 mt-1">{approvedLeaves} days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-red-50 p-3 rounded-full">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Rejected</h3>
                                <p className="text-2xl font-semibold text-gray-800 mt-1">{rejectedLeaves} days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-purple-50 p-3 rounded-full">
                                <CalendarDays className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Remaining</h3>
                                <p className="text-2xl font-semibold text-gray-800 mt-1">{remainingLeaves} days</p>
                                <p className="text-xs text-gray-500">of {totalAllowedLeaves} days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
                                <TableHead className="hidden lg:table-cell">Response</TableHead>
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
                                        <TableCell className="hidden lg:table-cell">
                                            <Skeleton className="h-5 w-28" />
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
                                                <span>{formatDate(leave.appliedOn)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(leave.startDate)}</TableCell>
                                        <TableCell>{formatDate(leave.endDate)}</TableCell>
                                        <TableCell>{leave.days} days</TableCell>
                                        <TableCell className="hidden md:table-cell max-w-[200px] truncate" title={leave.reason}>
                                            {leave.reason}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(leave.status)}</TableCell>
                                        <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                                            {leave.responseDate ? formatDate(leave.responseDate) : "-"}
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
        </div>
    )
}
