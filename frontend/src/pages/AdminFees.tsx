"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
    Search,
    Filter,
    Download,
    Mail,
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    ArrowUpDown,
    Eye,
    Send,
    MoreHorizontal,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Types
interface Student {
    id: string
    name: string
    class: string
    section: string
    rollNumber: string
    avatar?: string
    parentName: string
    parentEmail: string
    parentPhone: string
}

interface FeeType {
    id: string
    name: string
    amount: number
    dueDate: string
    description: string
}

interface FeePayment {
    id: string
    studentId: string
    feeTypeId: string
    amount: number
    status: "paid" | "partial" | "unpaid" | "overdue"
    dueDate: string
    paidDate?: string
    paidAmount: number
    remainingAmount: number
    paymentMethod?: "cash" | "bank_transfer" | "credit_card" | "online"
    transactionId?: string
    remarks?: string
}

// Mock Data
const mockStudents: Student[] = [
    {
        id: "STU001",
        name: "Aiden Smith",
        class: "Class 10",
        section: "A",
        rollNumber: "10A01",
        avatar: "/abstract-geometric-as.png",
        parentName: "John Smith",
        parentEmail: "john.smith@example.com",
        parentPhone: "+1 (555) 123-4567",
    },
    {
        id: "STU002",
        name: "Sophia Johnson",
        class: "Class 9",
        section: "B",
        rollNumber: "9B05",
        avatar: "/stylized-letters-sj.png",
        parentName: "Michael Johnson",
        parentEmail: "michael.j@example.com",
        parentPhone: "+1 (555) 234-5678",
    },
    {
        id: "STU003",
        name: "Ethan Williams",
        class: "Class 11",
        section: "A",
        rollNumber: "11A08",
        avatar: "/graffiti-ew.png",
        parentName: "Robert Williams",
        parentEmail: "robert.w@example.com",
        parentPhone: "+1 (555) 345-6789",
    },
    {
        id: "STU004",
        name: "Olivia Brown",
        class: "Class 8",
        section: "C",
        rollNumber: "8C12",
        avatar: "/abstract-geometric-ob.png",
        parentName: "David Brown",
        parentEmail: "david.b@example.com",
        parentPhone: "+1 (555) 456-7890",
    },
    {
        id: "STU005",
        name: "Noah Davis",
        class: "Class 12",
        section: "B",
        rollNumber: "12B03",
        avatar: "/abstract-geometric-shapes.png",
        parentName: "James Davis",
        parentEmail: "james.d@example.com",
        parentPhone: "+1 (555) 567-8901",
    },
    {
        id: "STU006",
        name: "Emma Wilson",
        class: "Class 7",
        section: "A",
        rollNumber: "7A09",
        avatar: "/graffiti-ew.png",
        parentName: "Thomas Wilson",
        parentEmail: "thomas.w@example.com",
        parentPhone: "+1 (555) 678-9012",
    },
    {
        id: "STU007",
        name: "Liam Miller",
        class: "Class 10",
        section: "B",
        rollNumber: "10B07",
        avatar: "/abstract-lm.png",
        parentName: "Charles Miller",
        parentEmail: "charles.m@example.com",
        parentPhone: "+1 (555) 789-0123",
    },
    {
        id: "STU008",
        name: "Ava Taylor",
        class: "Class 9",
        section: "A",
        rollNumber: "9A11",
        avatar: "/at-symbol-typography.png",
        parentName: "Daniel Taylor",
        parentEmail: "daniel.t@example.com",
        parentPhone: "+1 (555) 890-1234",
    },
    {
        id: "STU009",
        name: "Mason Anderson",
        class: "Class 11",
        section: "C",
        rollNumber: "11C02",
        avatar: "/stylized-letter-ma.png",
        parentName: "Paul Anderson",
        parentEmail: "paul.a@example.com",
        parentPhone: "+1 (555) 901-2345",
    },
    {
        id: "STU010",
        name: "Isabella Thomas",
        class: "Class 8",
        section: "B",
        rollNumber: "8B06",
        avatar: "/it-support-team.png",
        parentName: "Mark Thomas",
        parentEmail: "mark.t@example.com",
        parentPhone: "+1 (555) 012-3456",
    },
    {
        id: "STU011",
        name: "James Jackson",
        class: "Class 12",
        section: "A",
        rollNumber: "12A10",
        avatar: "/abstract-geometric-jj.png",
        parentName: "Steven Jackson",
        parentEmail: "steven.j@example.com",
        parentPhone: "+1 (555) 123-4567",
    },
    {
        id: "STU012",
        name: "Charlotte White",
        class: "Class 7",
        section: "C",
        rollNumber: "7C04",
        avatar: "/abstract-cw.png",
        parentName: "George White",
        parentEmail: "george.w@example.com",
        parentPhone: "+1 (555) 234-5678",
    },
]

const mockFeeTypes: FeeType[] = [
    {
        id: "FEE001",
        name: "Tuition Fee",
        amount: 5000,
        dueDate: "2025-05-10",
        description: "Monthly tuition fee for academic year 2025",
    },
]

// Generate mock fee payments with different statuses
const generateMockFeePayments = (): FeePayment[] => {
    const payments: FeePayment[] = []

    mockStudents.forEach((student) => {
        mockFeeTypes.forEach((feeType) => {
            // Randomly assign payment status
            const statuses: FeePayment["status"][] = ["paid", "partial", "unpaid", "overdue"]
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

            const dueDate = new Date(feeType.dueDate)
            const paidAmount =
                randomStatus === "paid"
                    ? feeType.amount
                    : randomStatus === "partial"
                        ? Math.round(feeType.amount * (0.3 + Math.random() * 0.5))
                        : 0

            const remainingAmount = feeType.amount - paidAmount

            // For some students, make specific fees overdue to demonstrate filtering
            let status = randomStatus
            if ((student.id === "STU001" || student.id === "STU005" || student.id === "STU009") && feeType.id === "FEE001") {
                status = "overdue"
            }

            // For some students, make specific fees unpaid
            if ((student.id === "STU002" || student.id === "STU007" || student.id === "STU011") && feeType.id === "FEE001") {
                status = "unpaid"
            }

            payments.push({
                id: `PAY-${student.id}-${feeType.id}`,
                studentId: student.id,
                feeTypeId: feeType.id,
                amount: feeType.amount,
                status: status,
                dueDate: feeType.dueDate,
                paidDate:
                    status === "paid" || status === "partial"
                        ? new Date(new Date(feeType.dueDate).getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split("T")[0]
                        : undefined,
                paidAmount: paidAmount,
                remainingAmount: remainingAmount,
                paymentMethod:
                    status === "paid" || status === "partial"
                        ? (["cash", "bank_transfer", "credit_card", "online"][Math.floor(Math.random() * 4)] as any)
                        : undefined,
                transactionId:
                    status === "paid" || status === "partial"
                        ? `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                        : undefined,
                remarks:
                    status === "overdue"
                        ? "Payment reminder sent"
                        : status === "partial"
                            ? "Partial payment received"
                            : undefined,
            })
        })
    })

    return payments
}

const mockFeePayments = generateMockFeePayments()

export default function AdminFeesDashboard() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [classFilter, setClassFilter] = useState<string>("all")
    const [feeTypeFilter, setFeeTypeFilter] = useState<string>("all")
    const [dateFilter, setDateFilter] = useState<string>("all")
    const [activeTab, setActiveTab] = useState("all")
    const [loading, setLoading] = useState(false)

    // Derived data for statistics
    const totalFees = mockFeePayments.reduce((sum, payment) => sum + payment.amount, 0)
    const collectedFees = mockFeePayments.reduce((sum, payment) => sum + payment.paidAmount, 0)
    const pendingFees = totalFees - collectedFees
    const collectionRate = (collectedFees / totalFees) * 100

    const overduePayments = mockFeePayments.filter((payment) => payment.status === "overdue")
    const unpaidPayments = mockFeePayments.filter((payment) => payment.status === "unpaid")
    const partialPayments = mockFeePayments.filter((payment) => payment.status === "partial")
    const paidPayments = mockFeePayments.filter((payment) => payment.status === "paid")

    // Get unique classes for filter
    const classes = [...new Set(mockStudents.map((student) => student.class))]

    // Filter fee payments based on search and filters
    const filteredPayments = mockFeePayments.filter((payment) => {
        const student = mockStudents.find((s) => s.id === payment.studentId)
        const feeType = mockFeeTypes.find((f) => f.id === payment.feeTypeId)

        if (!student || !feeType) return false

        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            feeType.name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || payment.status === statusFilter

        const matchesClass = classFilter === "all" || student.class === classFilter

        const matchesFeeType = feeTypeFilter === "all" || payment.feeTypeId === feeTypeFilter

        const matchesDate = dateFilter === "all"
        // In a real app, you would implement date filtering logic here

        const matchesTab =
            activeTab === "all" ||
            (activeTab === "overdue" && payment.status === "overdue") ||
            (activeTab === "unpaid" && payment.status === "unpaid") ||
            (activeTab === "partial" && payment.status === "partial") ||
            (activeTab === "paid" && payment.status === "paid")

        return matchesSearch && matchesStatus && matchesClass && matchesFeeType && matchesDate && matchesTab
    })

    // Simulate loading data
    useEffect(() => {
        setLoading(true)
        const timer = setTimeout(() => {
            setLoading(false)
        }, 800)

        return () => clearTimeout(timer)
    }, [])

    // Handle sending payment reminder
    const handleSendReminder = (studentId: string, feeTypeId: string) => {
        const student = mockStudents.find((s) => s.id === studentId)
        const feeType = mockFeeTypes.find((f) => f.id === feeTypeId)

        if (student && feeType) {
            toast.success(`Payment reminder sent to ${student.parentName} for ${feeType.name}`)
        }
    }

    // Handle marking as paid
    const handleMarkAsPaid = (paymentId: string) => {
        toast.success(`Payment ${paymentId} marked as paid`)
        // In a real app, you would update the payment status in your database
    }

    // Get status badge
    const getStatusBadge = (status: FeePayment["status"]) => {
        switch (status) {
            case "paid":
                return <Badge className="bg-green-500">Paid</Badge>
            case "partial":
                return <Badge className="bg-blue-500">Partial</Badge>
            case "unpaid":
                return <Badge className="bg-yellow-500">Unpaid</Badge>
            case "overdue":
                return <Badge className="bg-red-500">Overdue</Badge>
            default:
                return null
        }
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Fee Management</h1>
                    <p className="text-muted-foreground">Monitor and manage student fee payments</p>
                </div>

            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. {totalFees.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">For current academic year</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Collected</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. {collectedFees.toLocaleString()}</div>
                        <div className="flex items-center pt-1">
                            <Progress value={collectionRate} className="h-2" />
                            <span className="text-xs text-muted-foreground ml-2">{Math.round(collectionRate)}%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. {pendingFees.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {unpaidPayments.length + partialPayments.length} students with pending fees
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Rs. {overduePayments.reduce((sum, p) => sum + p.remainingAmount, 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">{overduePayments.length} overdue payments</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                    <TabsList>
                        <TabsTrigger value="all">All Payments</TabsTrigger>
                        <TabsTrigger value="overdue">Overdue</TabsTrigger>
                        <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
                        <TabsTrigger value="partial">Partial</TabsTrigger>
                        <TabsTrigger value="paid">Paid</TabsTrigger>
                    </TabsList>

                    {/* Search */}
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search student, roll no, parent..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 mb-4 justify-end">
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Class Filter */}
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {classes.map((cls) => (
                                <SelectItem key={cls} value={cls}>
                                    {cls}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" className="h-10 w-10">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                {/* Fee Payments Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Student</TableHead>
                                <TableHead>Fee Type</TableHead>
                                <TableHead>
                                    <div className="flex items-center">
                                        Amount
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center">
                                        Due Date
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Paid/Remaining</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        Loading fee payments...
                                    </TableCell>
                                </TableRow>
                            ) : filteredPayments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No fee payments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPayments.map((payment) => {
                                    const student = mockStudents.find((s) => s.id === payment.studentId)!
                                    const feeType = mockFeeTypes.find((f) => f.id === payment.feeTypeId)!

                                    return (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                                                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{student.name}</div>
                                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <span>
                                {student.class} {student.section}
                              </span>
                                                            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                Roll: {student.rollNumber}
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{feeType.name}</TableCell>
                                            <TableCell>Rs. {payment.amount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{format(new Date(payment.dueDate), "MMM d, yyyy")}</span>
                                                    {payment.status === "overdue" && (
                                                        <span className="text-xs text-red-500">
                              {Math.floor(
                                  (new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24),
                              )}{" "}
                                                            days overdue
                            </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                          <span className="text-xs text-green-600">
                            Paid: Rs. {payment.paidAmount.toLocaleString()}
                          </span>
                                                    {payment.remainingAmount > 0 && (
                                                        <span className="text-xs text-red-600">
                              Due: Rs. {payment.remainingAmount.toLocaleString()}
                            </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => toast.info(`Viewing payment details for ${payment.id}`)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        {(payment.status === "unpaid" ||
                                                            payment.status === "partial" ||
                                                            payment.status === "overdue") && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => handleMarkAsPaid(payment.id)}>
                                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                                    Pay Now
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleSendReminder(payment.studentId, payment.feeTypeId)}
                                                                >
                                                                    <Mail className="h-4 w-4 mr-2" />
                                                                    Send Reminder
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Tabs>
        </div>
    )
}
