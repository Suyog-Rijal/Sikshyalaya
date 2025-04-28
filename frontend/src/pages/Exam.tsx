"use client"

import {DialogFooter} from "@/components/ui/dialog"

import {PageHeader} from "@/components/ListPage/PageHeader.tsx"
import {Calendar, FileText, PlusCircle, Clock, BookOpen, Trash2} from "lucide-react"
import {FilterBar} from "@/components/ListPage/FilterBar.tsx"
// import { useNavigate } from "react-router-dom"
import {useEffect, useState} from "react"
import {toast} from "sonner"
import {format} from "date-fns"
import {Button} from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Skeleton} from "@/components/ui/skeleton"
import {Badge} from "@/components/ui/badge"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {useAuthStore} from "@/store/AuthStore.ts";

interface ExamRoutine {
    id: string
    examType: "Terminal Exam" | "Midterm Exam" | "Final Exam" | "Unit Test"
    subject: string
    class: string
    section: string
    date: string
    startTime: string
    endTime: string
    venue: string
    status: "upcoming" | "ongoing" | "completed"
}

export function ExamRoutinesPage() {
    // const navigate = useNavigate()
    const {role} = useAuthStore();

    const sortOptions = [
        {label: "Date (Earliest First)", value: "date_asc"},
        {label: "Date (Latest First)", value: "date_desc"},
        {label: "Subject A to Z", value: "subject_asc"},
        {label: "Subject Z to A", value: "subject_desc"},
        {label: "Class (Ascending)", value: "class_asc"},
        {label: "Class (Descending)", value: "class_desc"},
    ]

    const filterOptions = [
        {label: "All Exams", value: "all"},
        {label: "Terminal Exams", value: "terminal"},
        {label: "Midterm Exams", value: "midterm"},
        {label: "Final Exams", value: "final"},
        {label: "Unit Tests", value: "unit"},
        {label: "Upcoming", value: "upcoming"},
        {label: "Ongoing", value: "ongoing"},
        {label: "Completed", value: "completed"},
    ]

    const classOptions = [
        {label: "All Classes", value: "all"},
        {label: "Grade 8", value: "Grade 8"},
        {label: "Grade 9", value: "Grade 9"},
        {label: "Grade 10", value: "Grade 10"},
        {label: "Grade 11", value: "Grade 11"},
        {label: "Grade 12", value: "Grade 12"},
    ]

    const [examRoutines, setExamRoutines] = useState<ExamRoutine[]>([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterClass, setFilterClass] = useState("all")
    const [sortOrder, setSortOrder] = useState("date_asc")
    const [addExamOpen, setAddExamOpen] = useState(false)

    // Define the Zod schema for form validation
    const examFormSchema = z
        .object({
            examType: z.string({
                required_error: "Please select an exam type",
            }),
            subject: z
                .string({
                    required_error: "Please enter a subject",
                })
                .min(2, {
                    message: "Subject must be at least 2 characters",
                }),
            class: z.string({
                required_error: "Please select a class",
            }),
            section: z.string({
                required_error: "Please select a section",
            }),
            date: z.string({
                required_error: "Please select a date",
            }),
            startTime: z.string({
                required_error: "Please select a start time",
            }),
            endTime: z.string({
                required_error: "Please select an end time",
            }),
            venue: z
                .string({
                    required_error: "Please enter a venue",
                })
                .min(2, {
                    message: "Venue must be at least 2 characters",
                }),
        })
        .refine(
            (data) => {
                // Convert time strings to Date objects for comparison
                const startTime = new Date(`2000-01-01T${data.startTime}`)
                const endTime = new Date(`2000-01-01T${data.endTime}`)
                return endTime > startTime
            },
            {
                message: "End time must be after start time",
                path: ["endTime"],
            },
        )

    type ExamFormValues = z.infer<typeof examFormSchema>

    // Form with validation
    const form = useForm<ExamFormValues>({
        resolver: zodResolver(examFormSchema),
        defaultValues: {
            examType: "",
            subject: "",
            class: "",
            section: "",
            date: "",
            startTime: "",
            endTime: "",
            venue: "",
        },
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return format(date, "MMMM dd, yyyy")
    }

    const formatTime = (timeString: string) => {
        return timeString
    }

    useEffect(() => {
        // Simulate API call to fetch exam routines
        setTimeout(() => {
            const mockExamRoutines: ExamRoutine[] = [
                {
                    id: "11",
                    examType: "Unit Test",
                    subject: "Mathematics",
                    class: "Grade 1",
                    section: "A",
                    date: "2024-05-02",
                    startTime: "09:00 AM",
                    endTime: "10:00 AM",
                    venue: "Room 101",
                    status: "upcoming",
                },
                {
                    id: "12",
                    examType: "Terminal Exam",
                    subject: "English",
                    class: "Grade 1",
                    section: "B",
                    date: "2024-05-15",
                    startTime: "10:30 AM",
                    endTime: "11:30 AM",
                    venue: "Room 102",
                    status: "upcoming",
                },
                {
                    id: "13",
                    examType: "Midterm Exam",
                    subject: "Science",
                    class: "Grade 2",
                    section: "A",
                    date: "2024-05-20",
                    startTime: "09:00 AM",
                    endTime: "10:30 AM",
                    venue: "Room 103",
                    status: "upcoming",
                },
                {
                    id: "14",
                    examType: "Final Exam",
                    subject: "Social Studies",
                    class: "Grade 2",
                    section: "B",
                    date: "2024-06-10",
                    startTime: "11:00 AM",
                    endTime: "12:00 PM",
                    venue: "Room 104",
                    status: "upcoming",
                }
            ]

            setExamRoutines(mockExamRoutines)
            setLoading(false)
        }, 1500)
    }, [])

    const handleDelete = (id: string) => {
        // In a real app, this would call an API to delete the exam
        setExamRoutines((prev) => prev.filter((exam) => exam.id !== id))
        toast.success("Exam deleted successfully")
    }

    const handleAddExam = (values: ExamFormValues) => {
        // In a real app, this would call an API to add the exam
        const newExam: ExamRoutine = {
            id: `new-${Date.now()}`,
            examType: values.examType as any,
            subject: values.subject,
            class: values.class,
            section: values.section,
            date: values.date,
            startTime: values.startTime,
            endTime: values.endTime,
            venue: values.venue,
            status: "upcoming",
        }

        setExamRoutines((prev) => [newExam, ...prev])
        setAddExamOpen(false)
        form.reset()
        toast.success("Exam added successfully")
    }

    // Filtering logic
    const filteredExams = examRoutines.filter((exam) => {
        const searchMatch =
            exam.subject.toLowerCase().includes(searchText.toLowerCase()) ||
            exam.class.toLowerCase().includes(searchText.toLowerCase()) ||
            exam.venue.toLowerCase().includes(searchText.toLowerCase())

        let typeMatch = true
        if (filterStatus === "terminal") {
            typeMatch = exam.examType === "Terminal Exam"
        } else if (filterStatus === "midterm") {
            typeMatch = exam.examType === "Midterm Exam"
        } else if (filterStatus === "final") {
            typeMatch = exam.examType === "Final Exam"
        } else if (filterStatus === "unit") {
            typeMatch = exam.examType === "Unit Test"
        } else if (filterStatus === "upcoming") {
            typeMatch = exam.status === "upcoming"
        } else if (filterStatus === "ongoing") {
            typeMatch = exam.status === "ongoing"
        } else if (filterStatus === "completed") {
            typeMatch = exam.status === "completed"
        }

        let classMatch = true
        if (filterClass !== "all") {
            classMatch = exam.class === filterClass
        }

        return searchMatch && typeMatch && classMatch
    })

    // Sorting logic
    const sortedExams = [...filteredExams].sort((a, b) => {
        if (sortOrder === "date_asc") return new Date(a.date).getTime() - new Date(b.date).getTime()
        if (sortOrder === "date_desc") return new Date(b.date).getTime() - new Date(a.date).getTime()
        if (sortOrder === "subject_asc") return a.subject.localeCompare(b.subject)
        if (sortOrder === "subject_desc") return b.subject.localeCompare(a.subject)
        if (sortOrder === "class_asc") return a.class.localeCompare(b.class)
        if (sortOrder === "class_desc") return b.class.localeCompare(a.class)
        return 0
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "upcoming":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Upcoming
                    </Badge>
                )
            case "ongoing":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ongoing
                    </Badge>
                )
            case "completed":
                return (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Completed
                    </Badge>
                )
            default:
                return null
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4 bg-gray-50">
            <div>
                {
                    role === 'admin' ? (
                        <PageHeader
                            title="Exam Routines"
                            breadcrumbs={[
                                {label: "Dashboard", href: "/"},
                                {label: "Academics", href: "/academics/"},
                                {label: "Exam Routines", href: "/academics/exam-routines/"},
                            ]}
                            primaryAction={{
                                label: "Add Exam",
                                onClick: () => setAddExamOpen(true),
                                icon: <PlusCircle className="h-4 w-4"/>,
                            }}
                        />
                    ) : (
                        <PageHeader
                            title="Exam Routines"
                            breadcrumbs={[
                                {label: "Dashboard", href: "/"},
                                {label: "Academics", href: "/academics/"},
                                {label: "Exam Routines", href: "/academics/exam-routines/"},
                            ]}
                        />
                    )
                }
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <FilterBar
                        title="Exam Schedule"
                        onSortChange={(sort) => setSortOrder(sort)}
                        onFilterChange={(filter) => setFilterStatus(filter)}
                        onSearchChange={(text) => setSearchText(text)}
                        sortOptions={sortOptions}
                        filterOptions={filterOptions}
                    />
                    <div className="w-full md:w-64">
                        <Select value={filterClass} onValueChange={setFilterClass}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter by class"/>
                            </SelectTrigger>
                            <SelectContent>
                                {classOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Summary Cards - Moved to the top */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-md">
                            <BookOpen className="h-5 w-5 text-blue-600"/>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Upcoming Exams</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {examRoutines.filter((e) => e.status === "upcoming").length} exams scheduled
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-green-50 p-2 rounded-md">
                            <Clock className="h-5 w-5 text-green-600"/>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Ongoing Exams</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {examRoutines.filter((e) => e.status === "ongoing").length} exams in progress
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="bg-gray-50 p-2 rounded-md">
                            <FileText className="h-5 w-5 text-gray-600"/>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Completed Exams</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {examRoutines.filter((e) => e.status === "completed").length} exams completed
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Routines Table */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Exam Type</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead className="hidden md:table-cell">Class</TableHead>
                            <TableHead className="hidden lg:table-cell">Date</TableHead>
                            <TableHead className="hidden lg:table-cell">Time</TableHead>
                            <TableHead className="hidden xl:table-cell">Venue</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Loading skeleton
                            Array.from({length: 5}).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-5 w-24"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-32"/>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Skeleton className="h-5 w-20"/>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <Skeleton className="h-5 w-28"/>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <Skeleton className="h-5 w-28"/>
                                    </TableCell>
                                    <TableCell className="hidden xl:table-cell">
                                        <Skeleton className="h-5 w-24"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-20"/>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-9 w-20 ml-auto"/>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : sortedExams.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    No exam routines found. Add some exams to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedExams.map((exam) => (
                                <TableRow key={exam.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-gray-500"/>
                                            <span className="font-medium">{exam.examType}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{exam.subject}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {exam.class} {exam.section}
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-gray-500"/>
                                            <span>{formatDate(exam.date)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5 text-gray-500"/>
                                            <span>
                        {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
                      </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden xl:table-cell">{exam.venue}</TableCell>
                                    <TableCell>{getStatusBadge(exam.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    Actions
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuItem onClick={() => handleDelete(exam.id)}
                                                                  className="text-red-600">
                                                    <Trash2 className="h-4 w-4 mr-2"/>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add Exam Dialog */}
            <Dialog
                open={addExamOpen}
                onOpenChange={(open) => {
                    setAddExamOpen(open)
                    if (!open) form.reset()
                }}
            >
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Exam</DialogTitle>
                        <DialogDescription>Enter the details for the new exam schedule.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddExam)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="examType"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Exam Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select exam type"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Terminal Exam">Terminal Exam</SelectItem>
                                                    <SelectItem value="Midterm Exam">Midterm Exam</SelectItem>
                                                    <SelectItem value="Final Exam">Final Exam</SelectItem>
                                                    <SelectItem value="Unit Test">Unit Test</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter subject name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="class"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Class</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select class"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Grade 8">Grade 8</SelectItem>
                                                    <SelectItem value="Grade 9">Grade 9</SelectItem>
                                                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                                                    <SelectItem value="Grade 11">Grade 11</SelectItem>
                                                    <SelectItem value="Grade 12">Grade 12</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="section"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Section</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select section"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="A">Section A</SelectItem>
                                                    <SelectItem value="B">Section B</SelectItem>
                                                    <SelectItem value="C">Section C</SelectItem>
                                                    <SelectItem value="D">Section D</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="date"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="startTime"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endTime"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="venue"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Room/Venue</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter exam venue" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={() => setAddExamOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Add Exam</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
