"use client"

import { useState } from "react"
import { Search, ChevronDown, FileText, Calendar, Clock, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Types for our data
interface FeeRecord {
    id: string
    studentId: string
    studentName: string
    class: string
    section: string
    feeType: string
    amount: number
    dueDate: string
    status: "paid" | "pending" | "overdue" | "partial"
    paidAmount?: number
    paymentDate?: string
}

export function FeeManagementSystem() {
    // State for filters
    const [searchQuery, setSearchQuery] = useState("")
    const [classFilter, setClassFilter] = useState("All Classes")
    const [statusFilter, setStatusFilter] = useState("All")
    // const [sortBy, setSortBy] = useState("Due Date")

    // State for dialogs
    const [viewFeeDialogOpen, setViewFeeDialogOpen] = useState(false)
    const [recordPaymentDialogOpen, setRecordPaymentDialogOpen] = useState(false)
    const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null)
    const [paymentAmount, setPaymentAmount] = useState<number>(0)
    const [paymentMethod, setPaymentMethod] = useState<string>("cash")
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [paymentNotes, setPaymentNotes] = useState<string>("")

    // Mock data for fee records
    const feeRecords: FeeRecord[] = [
        {
            id: "fee-001",
            studentId: "ST001",
            studentName: "Test Copeland",
            class: "Grade 1",
            section: "A",
            feeType: "Tuition Fee",
            amount: 5000,
            dueDate: "2024-05-15",
            status: "paid",
            paidAmount: 5000,
            paymentDate: "2024-05-10",
        },
        {
            id: "fee-001",
            studentId: "ST001",
            studentName: "Test Copeland",
            class: "Grade 1",
            section: "A",
            feeType: "Tuition Fee",
            amount: 5000,
            dueDate: "2024-05-15",
            status: "pending",
            paidAmount: 5000,
            paymentDate: "2024-05-10",
        },

    ]

    // Filter fee records based on selected filters and search query
    const filteredFeeRecords = feeRecords.filter((record) => {
        const matchesClass = classFilter === "All Classes" || record.class === classFilter
        const matchesStatus = statusFilter === "All" || record.status === statusFilter.toLowerCase()
        const matchesSearch =
            record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.feeType.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesClass && matchesStatus && matchesSearch
    })

    // Count records by status
    const paidCount = feeRecords.filter((record) => record.status === "paid").length
    const pendingCount = feeRecords.filter((record) => record.status === "pending").length
    const overdueCount = feeRecords.filter((record) => record.status === "overdue").length

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount)
    }

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
            case "pending":
                return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
            case "overdue":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
            case "partial":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Partial</Badge>
            default:
                return null
        }
    }

    // Handle view fee details
    const handleViewFee = (fee: FeeRecord) => {
        setSelectedFee(fee)
        setViewFeeDialogOpen(true)
    }

    // Handle record payment
    const handleRecordPayment = (fee: FeeRecord) => {
        setSelectedFee(fee)

        // Set default values for payment form
        if (fee.status === "partial" && fee.paidAmount) {
            setPaymentAmount(fee.amount - fee.paidAmount)
        } else {
            setPaymentAmount(fee.amount)
        }

        setPaymentMethod("cash")
        setPaymentDate(new Date().toISOString().split("T")[0])
        setPaymentNotes("")

        setRecordPaymentDialogOpen(true)
    }

    // Handle submit payment
    const handleSubmitPayment = () => {
        if (!selectedFee) return

        // In a real application, you would call your API to record the payment
        console.log("Recording payment:", {
            feeId: selectedFee.id,
            amount: paymentAmount,
            method: paymentMethod,
            date: paymentDate,
            notes: paymentNotes,
        })

        // Close the dialog
        setRecordPaymentDialogOpen(false)
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Fee Management</h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Overdue">Overdue</SelectItem>
                            <SelectItem value="Partial">Partial</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                        <span className="text-sm text-gray-500 mr-2">Sort by</span>
                        <span className="text-sm">Due Date</span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </div>

                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All Classes">All Classes</SelectItem>
                            <SelectItem value="Grade 1">Grade 1</SelectItem>
                            <SelectItem value="Grade 2">Grade 2</SelectItem>
                            <SelectItem value="Grade 3">Grade 3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="p-2 bg-blue-50 rounded-md">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-medium">Paid Fees</h3>
                            <p className="text-2xl font-semibold">{paidCount} fees paid</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="p-2 bg-amber-50 rounded-md">
                            <Clock className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-medium">Pending Fees</h3>
                            <p className="text-2xl font-semibold">{pendingCount} fees pending</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="p-2 bg-red-50 rounded-md">
                            <Calendar className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-medium">Overdue Fees</h3>
                            <p className="text-2xl font-semibold">{overdueCount} fees overdue</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Fee Records Table */}
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fee Type</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFeeRecords.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                        {record.feeType}
                                    </div>
                                </TableCell>
                                <TableCell>{record.studentName}</TableCell>
                                <TableCell>
                                    {record.class} {record.section}
                                </TableCell>
                                <TableCell>{formatDate(record.dueDate)}</TableCell>
                                <TableCell>
                                    <div>{formatCurrency(record.amount)}</div>
                                    {record.status === "partial" && record.paidAmount && (
                                        <div className="text-xs text-gray-500">Paid: {formatCurrency(record.paidAmount)}</div>
                                    )}
                                </TableCell>
                                <TableCell>{getStatusBadge(record.status)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleViewFee(record)}>
                                        View
                                    </Button>
                                    {record.status !== "paid" && (
                                        <Button variant="outline" size="sm" onClick={() => handleRecordPayment(record)}>
                                            Pay
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* View Fee Details Dialog */}
            <Dialog open={viewFeeDialogOpen} onOpenChange={setViewFeeDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Fee Details</DialogTitle>
                        <DialogDescription>
                            {selectedFee?.feeType} for {selectedFee?.studentName}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedFee && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm text-gray-500">Student Name</Label>
                                    <p className="font-medium">{selectedFee.studentName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Student ID</Label>
                                    <p className="font-medium">{selectedFee.studentId}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Class</Label>
                                    <p className="font-medium">
                                        {selectedFee.class} {selectedFee.section}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Fee Type</Label>
                                    <p className="font-medium">{selectedFee.feeType}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Amount</Label>
                                    <p className="font-medium">{formatCurrency(selectedFee.amount)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Due Date</Label>
                                    <p className="font-medium">{formatDate(selectedFee.dueDate)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Status</Label>
                                    <div>{getStatusBadge(selectedFee.status)}</div>
                                </div>
                                {selectedFee.status === "paid" || selectedFee.status === "partial" ? (
                                    <div>
                                        <Label className="text-sm text-gray-500">Payment Date</Label>
                                        <p className="font-medium">{selectedFee.paymentDate && formatDate(selectedFee.paymentDate)}</p>
                                    </div>
                                ) : null}
                                {selectedFee.status === "partial" && selectedFee.paidAmount && (
                                    <>
                                        <div>
                                            <Label className="text-sm text-gray-500">Paid Amount</Label>
                                            <p className="font-medium">{formatCurrency(selectedFee.paidAmount)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-500">Remaining</Label>
                                            <p className="font-medium">{formatCurrency(selectedFee.amount - selectedFee.paidAmount)}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setViewFeeDialogOpen(false)}>
                            Close
                        </Button>
                        {selectedFee && selectedFee.status !== "paid" && (
                            <Button
                                onClick={() => {
                                    setViewFeeDialogOpen(false)
                                    handleRecordPayment(selectedFee)
                                }}
                            >
                                Record Payment
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Record Payment Dialog */}
            <Dialog open={recordPaymentDialogOpen} onOpenChange={setRecordPaymentDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                        <DialogDescription>
                            {selectedFee?.feeType} for {selectedFee?.studentName}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedFee && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm text-gray-500">Total Amount</Label>
                                    <p className="font-medium">{formatCurrency(selectedFee.amount)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Due Date</Label>
                                    <p className="font-medium">{formatDate(selectedFee.dueDate)}</p>
                                </div>
                                {selectedFee.status === "partial" && selectedFee.paidAmount && (
                                    <>
                                        <div>
                                            <Label className="text-sm text-gray-500">Already Paid</Label>
                                            <p className="font-medium">{formatCurrency(selectedFee.paidAmount)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-500">Remaining</Label>
                                            <p className="font-medium">{formatCurrency(selectedFee.amount - selectedFee.paidAmount)}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment-amount">Payment Amount</Label>
                                <Input
                                    id="payment-amount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment-method">Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger id="payment-method">
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="credit_card">Credit Card</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="check">Check</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment-date">Payment Date</Label>
                                <Input
                                    id="payment-date"
                                    type="date"
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment-notes">Notes (Optional)</Label>
                                <Textarea
                                    id="payment-notes"
                                    placeholder="Add any additional notes"
                                    value={paymentNotes}
                                    onChange={(e) => setPaymentNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRecordPaymentDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitPayment}>Record Payment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default FeeManagementSystem



// Parent fee system
// "use client"
//
// import type React from "react"
//
// import { useState } from "react"
// import { Search, ChevronDown, FileText, Download, CreditCard } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
//
// // Types for our data
// interface FeeRecord {
//     id: string
//     feeType: string
//     amount: number
//     dueDate: string
//     status: "paid" | "pending" | "overdue" | "partial"
//     paidAmount?: number
//     paymentDate?: string
//     receiptNo?: string
// }
//
// export function ParentFeePage() {
//     // State for filters
//     const [searchQuery, setSearchQuery] = useState("")
//     const [statusFilter, setStatusFilter] = useState("All")
//     const [sortBy, setSortBy] = useState("Due Date")
//
//     // State for dialogs
//     const [viewFeeDialogOpen, setViewFeeDialogOpen] = useState(false)
//     const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
//     const [receiptDialogOpen, setReceiptDialogOpen] = useState(false)
//     const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null)
//
//     // Child information
//     const childInfo = {
//         name: "Aiden Smith",
//         id: "ST001",
//         class: "Grade 1",
//         section: "A",
//     }
//
//     // Mock data for fee records - only school fees
//     const feeRecords: FeeRecord[] = [
//         {
//             id: "fee-001",
//             feeType: "School Fee (April)",
//             amount: 5000,
//             dueDate: "2024-04-15",
//             status: "paid",
//             paidAmount: 5000,
//             paymentDate: "2024-04-10",
//             receiptNo: "REC-2024-001",
//         },
//         {
//             id: "fee-002",
//             feeType: "School Fee (May)",
//             amount: 5000,
//             dueDate: "2024-05-15",
//             status: "pending",
//         },
//         {
//             id: "fee-003",
//             feeType: "School Fee (June)",
//             amount: 5000,
//             dueDate: "2024-06-15",
//             status: "pending",
//         },
//         {
//             id: "fee-004",
//             feeType: "School Fee (July)",
//             amount: 5000,
//             dueDate: "2024-07-15",
//             status: "pending",
//         },
//     ]
//
//     // Filter fee records based on selected filters and search query
//     const filteredFeeRecords = feeRecords.filter((record) => {
//         const matchesStatus = statusFilter === "All" || record.status === statusFilter.toLowerCase()
//         const matchesSearch = record.feeType.toLowerCase().includes(searchQuery.toLowerCase())
//
//         return matchesStatus && matchesSearch
//     })
//
//     // Format currency
//     const formatCurrency = (amount: number) => {
//         return new Intl.NumberFormat("en-US", {
//             style: "currency",
//             currency: "USD",
//             minimumFractionDigits: 2,
//         }).format(amount)
//     }
//
//     // Format date
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString)
//         return date.toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//         })
//     }
//
//     // Get status badge
//     const getStatusBadge = (status: string) => {
//         switch (status) {
//             case "paid":
//                 return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
//             case "pending":
//                 return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
//             case "overdue":
//                 return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
//             case "partial":
//                 return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Partial</Badge>
//             default:
//                 return null
//         }
//     }
//
//     // Handle view fee details
//     const handleViewFee = (fee: FeeRecord) => {
//         setSelectedFee(fee)
//         setViewFeeDialogOpen(true)
//     }
//
//     // Handle pay now
//     const handlePayNow = (fee: FeeRecord) => {
//         setSelectedFee(fee)
//         setPaymentDialogOpen(true)
//     }
//
//     // Handle view receipt
//     const handleViewReceipt = (fee: FeeRecord) => {
//         setSelectedFee(fee)
//         setReceiptDialogOpen(true)
//     }
//
//     // Handle eSewa payment
//     const handleESewaPayment = () => {
//         if (!selectedFee) return
//
//         // In a real application, you would redirect to eSewa payment gateway
//         console.log("Redirecting to eSewa payment for:", {
//             feeId: selectedFee.id,
//             amount:
//                 selectedFee.status === "partial" && selectedFee.paidAmount
//                     ? selectedFee.amount - selectedFee.paidAmount
//                     : selectedFee.amount,
//             studentName: childInfo.name,
//             feeType: selectedFee.feeType,
//         })
//
//         // Close the dialog
//         setPaymentDialogOpen(false)
//
//         // Show a success message or redirect to eSewa
//         alert("Redirecting to eSewa payment gateway...")
//     }
//
//     return (
//         <div className="container mx-auto p-6 space-y-6">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">Fee Management</h1>
//                     <p className="text-gray-500">
//                         Student: {childInfo.name} | Class: {childInfo.class} {childInfo.section} | ID: {childInfo.id}
//                     </p>
//                 </div>
//             </div>
//
//             <div className="flex flex-col sm:flex-row gap-4 justify-between">
//                 <div className="relative flex-grow">
//                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
//                     <Input
//                         type="search"
//                         placeholder="Search fees..."
//                         className="pl-8"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                 </div>
//
//                 <div className="flex flex-wrap gap-2">
//                     <Select value={statusFilter} onValueChange={setStatusFilter}>
//                         <SelectTrigger className="w-[130px]">
//                             <SelectValue placeholder="Filter" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="All">All</SelectItem>
//                             <SelectItem value="Paid">Paid</SelectItem>
//                             <SelectItem value="Pending">Pending</SelectItem>
//                             <SelectItem value="Overdue">Overdue</SelectItem>
//                         </SelectContent>
//                     </Select>
//
//                     <div className="flex items-center border rounded-md px-3 py-2 bg-white">
//                         <span className="text-sm text-gray-500 mr-2">Sort by</span>
//                         <span className="text-sm">Due Date</span>
//                         <ChevronDown className="h-4 w-4 ml-2" />
//                     </div>
//                 </div>
//             </div>
//
//             {/* Fee Records Tabs */}
//             <Tabs defaultValue="all" className="w-full">
//                 <TabsList className="grid w-full grid-cols-3 mb-4">
//                     <TabsTrigger value="all">All</TabsTrigger>
//                     <TabsTrigger value="pending">Pending</TabsTrigger>
//                     <TabsTrigger value="paid">Paid</TabsTrigger>
//                 </TabsList>
//
//                 <TabsContent value="all">
//                     <FeeTable
//                         fees={filteredFeeRecords}
//                         formatCurrency={formatCurrency}
//                         formatDate={formatDate}
//                         getStatusBadge={getStatusBadge}
//                         onViewFee={handleViewFee}
//                         onPayNow={handlePayNow}
//                         onViewReceipt={handleViewReceipt}
//                     />
//                 </TabsContent>
//
//                 <TabsContent value="pending">
//                     <FeeTable
//                         fees={filteredFeeRecords.filter((fee) => fee.status === "pending" || fee.status === "overdue")}
//                         formatCurrency={formatCurrency}
//                         formatDate={formatDate}
//                         getStatusBadge={getStatusBadge}
//                         onViewFee={handleViewFee}
//                         onPayNow={handlePayNow}
//                         onViewReceipt={handleViewReceipt}
//                     />
//                 </TabsContent>
//
//                 <TabsContent value="paid">
//                     <FeeTable
//                         fees={filteredFeeRecords.filter((fee) => fee.status === "paid" || fee.status === "partial")}
//                         formatCurrency={formatCurrency}
//                         formatDate={formatDate}
//                         getStatusBadge={getStatusBadge}
//                         onViewFee={handleViewFee}
//                         onPayNow={handlePayNow}
//                         onViewReceipt={handleViewReceipt}
//                     />
//                 </TabsContent>
//             </Tabs>
//
//             {/* View Fee Details Dialog */}
//             <Dialog open={viewFeeDialogOpen} onOpenChange={setViewFeeDialogOpen}>
//                 <DialogContent className="sm:max-w-[500px]">
//                     <DialogHeader>
//                         <DialogTitle>Fee Details</DialogTitle>
//                         <DialogDescription>{selectedFee?.feeType}</DialogDescription>
//                     </DialogHeader>
//
//                     {selectedFee && (
//                         <div className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <Label className="text-sm text-gray-500">Student Name</Label>
//                                     <p className="font-medium">{childInfo.name}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm text-gray-500">Student ID</Label>
//                                     <p className="font-medium">{childInfo.id}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm text-gray-500">Class</Label>
//                                     <p className="font-medium">
//                                         {childInfo.class} {childInfo.section}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm text-gray-500">Fee Type</Label>
//                                     <p className="font-medium">{selectedFee.feeType}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm text-gray-500">Amount</Label>
//                                     <p className="font-medium">{formatCurrency(selectedFee.amount)}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm text-gray-500">Due Date</Label>
//                                     <p className="font-medium">{formatDate(selectedFee.dueDate)}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm text-gray-500">Status</Label>
//                                     <div>{getStatusBadge(selectedFee.status)}</div>
//                                 </div>
//                                 {selectedFee.status === "paid" || selectedFee.status === "partial" ? (
//                                     <div>
//                                         <Label className="text-sm text-gray-500">Payment Date</Label>
//                                         <p className="font-medium">{selectedFee.paymentDate && formatDate(selectedFee.paymentDate)}</p>
//                                     </div>
//                                 ) : null}
//                                 {selectedFee.status === "partial" && selectedFee.paidAmount && (
//                                     <>
//                                         <div>
//                                             <Label className="text-sm text-gray-500">Paid Amount</Label>
//                                             <p className="font-medium">{formatCurrency(selectedFee.paidAmount)}</p>
//                                         </div>
//                                         <div>
//                                             <Label className="text-sm text-gray-500">Remaining</Label>
//                                             <p className="font-medium">{formatCurrency(selectedFee.amount - selectedFee.paidAmount)}</p>
//                                         </div>
//                                     </>
//                                 )}
//                                 {(selectedFee.status === "paid" || selectedFee.status === "partial") && selectedFee.receiptNo && (
//                                     <div>
//                                         <Label className="text-sm text-gray-500">Receipt No</Label>
//                                         <p className="font-medium">{selectedFee.receiptNo}</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//
//                     <DialogFooter className="flex justify-between">
//                         <Button variant="outline" onClick={() => setViewFeeDialogOpen(false)}>
//                             Close
//                         </Button>
//                         {selectedFee &&
//                             (selectedFee.status === "pending" ||
//                                 selectedFee.status === "overdue" ||
//                                 selectedFee.status === "partial") && (
//                                 <Button
//                                     onClick={() => {
//                                         setViewFeeDialogOpen(false)
//                                         handlePayNow(selectedFee)
//                                     }}
//                                 >
//                                     Pay Now
//                                 </Button>
//                             )}
//                         {selectedFee &&
//                             (selectedFee.status === "paid" || selectedFee.status === "partial") &&
//                             selectedFee.receiptNo && (
//                                 <Button
//                                     variant="outline"
//                                     onClick={() => {
//                                         setViewFeeDialogOpen(false)
//                                         handleViewReceipt(selectedFee)
//                                     }}
//                                 >
//                                     View Receipt
//                                 </Button>
//                             )}
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//
//             {/* eSewa Payment Dialog */}
//             <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
//                 <DialogContent className="sm:max-w-[500px]">
//                     <DialogHeader>
//                         <DialogTitle>Pay with eSewa</DialogTitle>
//                         <DialogDescription>{selectedFee?.feeType}</DialogDescription>
//                     </DialogHeader>
//
//                     {selectedFee && (
//                         <div className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <Label className="text-sm text-gray-500">Student Name</Label>
//                                     <p className="font-medium">{childInfo.name}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm text-gray-500">Fee Type</Label>
//                                     <p className="font-medium">{selectedFee.feeType}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm text-gray-500">Total Amount</Label>
//                                     <p className="font-medium">{formatCurrency(selectedFee.amount)}</p>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm text-gray-500">Due Date</Label>
//                                     <p className="font-medium">{formatDate(selectedFee.dueDate)}</p>
//                                 </div>
//                                 {selectedFee.status === "partial" && selectedFee.paidAmount && (
//                                     <>
//                                         <div>
//                                             <Label className="text-sm text-gray-500">Already Paid</Label>
//                                             <p className="font-medium">{formatCurrency(selectedFee.paidAmount)}</p>
//                                         </div>
//                                         <div>
//                                             <Label className="text-sm text-gray-500">Amount to Pay</Label>
//                                             <p className="font-medium font-bold text-blue-600">
//                                                 {formatCurrency(selectedFee.amount - selectedFee.paidAmount)}
//                                             </p>
//                                         </div>
//                                     </>
//                                 )}
//                                 {selectedFee.status !== "partial" && (
//                                     <div className="col-span-2">
//                                         <Label className="text-sm text-gray-500">Amount to Pay</Label>
//                                         <p className="font-medium font-bold text-blue-600">{formatCurrency(selectedFee.amount)}</p>
//                                     </div>
//                                 )}
//                             </div>
//
//                             <div className="border rounded-md p-4 bg-green-50">
//                                 <div className="flex items-center gap-2 mb-2">
//                                     <CreditCard className="h-5 w-5 text-green-600" />
//                                     <h3 className="font-medium">Payment Method: eSewa</h3>
//                                 </div>
//                                 <p className="text-sm text-gray-600 mb-4">
//                                     You will be redirected to the eSewa payment gateway to complete your payment securely.
//                                 </p>
//                                 <div className="flex justify-center">
//                                     <img src="/eSewa-digital-payment.png" alt="eSewa" className="h-10" />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
//                             Cancel
//                         </Button>
//                         <Button onClick={handleESewaPayment} className="bg-green-600 hover:bg-green-700">
//                             Proceed to eSewa
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//
//             {/* Receipt Dialog */}
//             <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
//                 <DialogContent className="sm:max-w-[600px]">
//                     <DialogHeader>
//                         <DialogTitle>Payment Receipt</DialogTitle>
//                         <DialogDescription>Receipt #{selectedFee?.receiptNo}</DialogDescription>
//                     </DialogHeader>
//
//                     {selectedFee && (
//                         <div className="space-y-6">
//                             <div className="flex justify-between items-center border-b pb-4">
//                                 <div>
//                                     <h2 className="font-bold text-xl">School Name</h2>
//                                     <p className="text-gray-500">123 Education Street, City</p>
//                                     <p className="text-gray-500">Phone: (123) 456-7890</p>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="font-medium">Receipt No: {selectedFee.receiptNo}</p>
//                                     <p className="text-gray-500">
//                                         Date: {selectedFee.paymentDate && formatDate(selectedFee.paymentDate)}
//                                     </p>
//                                 </div>
//                             </div>
//
//                             <div className="space-y-4">
//                                 <h3 className="font-medium">Student Information</h3>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <Label className="text-sm text-gray-500">Student Name</Label>
//                                         <p className="font-medium">{childInfo.name}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-sm text-gray-500">Student ID</Label>
//                                         <p className="font-medium">{childInfo.id}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-sm text-gray-500">Class</Label>
//                                         <p className="font-medium">
//                                             {childInfo.class} {childInfo.section}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             <div className="space-y-4">
//                                 <h3 className="font-medium">Payment Details</h3>
//                                 <Table>
//                                     <TableHeader>
//                                         <TableRow>
//                                             <TableHead>Description</TableHead>
//                                             <TableHead>Amount</TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         <TableRow>
//                                             <TableCell>{selectedFee.feeType}</TableCell>
//                                             <TableCell>
//                                                 {selectedFee.status === "partial" && selectedFee.paidAmount
//                                                     ? formatCurrency(selectedFee.paidAmount)
//                                                     : formatCurrency(selectedFee.amount)}
//                                             </TableCell>
//                                         </TableRow>
//                                         <TableRow>
//                                             <TableCell className="font-bold">Total</TableCell>
//                                             <TableCell className="font-bold">
//                                                 {selectedFee.status === "partial" && selectedFee.paidAmount
//                                                     ? formatCurrency(selectedFee.paidAmount)
//                                                     : formatCurrency(selectedFee.amount)}
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </div>
//
//                             <div className="border-t pt-4 flex justify-between items-center">
//                                 <div>
//                                     <p className="font-medium">Payment Method: eSewa</p>
//                                     <p className="text-sm text-gray-500">Transaction ID: ESW{Math.floor(Math.random() * 1000000)}</p>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-sm text-gray-500">This is a computer generated receipt.</p>
//                                     <p className="text-sm text-gray-500">No signature required.</p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setReceiptDialogOpen(false)}>
//                             Close
//                         </Button>
//                         <Button variant="outline">
//                             <Download className="h-4 w-4 mr-2" />
//                             Download
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     )
// }
//
// // Fee Table Component
// interface FeeTableProps {
//     fees: FeeRecord[]
//     formatCurrency: (amount: number) => string
//     formatDate: (date: string) => string
//     getStatusBadge: (status: string) => React.ReactNode
//     onViewFee: (fee: FeeRecord) => void
//     onPayNow: (fee: FeeRecord) => void
//     onViewReceipt: (fee: FeeRecord) => void
// }
//
// function FeeTable({
//                       fees,
//                       formatCurrency,
//                       formatDate,
//                       getStatusBadge,
//                       onViewFee,
//                       onPayNow,
//                       onViewReceipt,
//                   }: FeeTableProps) {
//     return (
//         <Table>
//             <TableHeader>
//                 <TableRow>
//                     <TableHead>Fee Type</TableHead>
//                     <TableHead>Due Date</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//             </TableHeader>
//             <TableBody>
//                 {fees.length > 0 ? (
//                     fees.map((fee) => (
//                         <TableRow key={fee.id}>
//                             <TableCell className="font-medium">
//                                 <div className="flex items-center gap-2">
//                                     <FileText className="h-4 w-4 text-gray-400" />
//                                     {fee.feeType}
//                                 </div>
//                             </TableCell>
//                             <TableCell>{formatDate(fee.dueDate)}</TableCell>
//                             <TableCell>
//                                 <div>{formatCurrency(fee.amount)}</div>
//                                 {fee.status === "partial" && fee.paidAmount && (
//                                     <div className="text-xs text-gray-500">Paid: {formatCurrency(fee.paidAmount)}</div>
//                                 )}
//                             </TableCell>
//                             <TableCell>{getStatusBadge(fee.status)}</TableCell>
//                             <TableCell className="text-right">
//                                 <Button variant="ghost" size="sm" onClick={() => onViewFee(fee)}>
//                                     View
//                                 </Button>
//                                 {(fee.status === "pending" || fee.status === "overdue" || fee.status === "partial") && (
//                                     <Button variant="outline" size="sm" onClick={() => onPayNow(fee)}>
//                                         Pay Now
//                                     </Button>
//                                 )}
//                                 {(fee.status === "paid" || fee.status === "partial") && fee.receiptNo && (
//                                     <Button variant="ghost" size="sm" onClick={() => onViewReceipt(fee)}>
//                                         Receipt
//                                     </Button>
//                                 )}
//                             </TableCell>
//                         </TableRow>
//                     ))
//                 ) : (
//                     <TableRow>
//                         <TableCell colSpan={5} className="text-center py-6 text-gray-500">
//                             No fee records found
//                         </TableCell>
//                     </TableRow>
//                 )}
//             </TableBody>
//         </Table>
//     )
// }
//
// export default ParentFeePage
//
