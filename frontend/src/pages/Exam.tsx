"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import { Calendar, FileText, PlusCircle, Clock, BookOpen, Trash2, MoreHorizontal, Pencil } from "lucide-react"
import { FilterBar } from "@/components/ListPage/FilterBar.tsx"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuthStore } from "@/store/AuthStore.ts"
import axiosInstance from "@/auth/AxiosInstance.ts"

interface ExamRoutine {
    id: string
    exam_date: string
    start_time: string
    end_time: string
    subject: string
    school_class: string
    exam_type: string
    created_at: string
    status?: "upcoming" | "ongoing" | "completed"
}

// Interface for the API response
interface ClassData {
    id: string
    name: string
    section: {
        id: string
        name: string
    }[]
    subjects: {
        id: string
        name: string
    }[]
}

export function ExamRoutinesPage() {
    // const navigate = useNavigate()
    const { role } = useAuthStore()

    const sortOptions = [
        { label: "Date (Earliest First)", value: "date_asc" },
        { label: "Date (Latest First)", value: "date_desc" },
        { label: "Subject A to Z", value: "subject_asc" },
        { label: "Subject Z to A", value: "subject_desc" },
        { label: "Class (Ascending)", value: "class_asc" },
        { label: "Class (Descending)", value: "class_desc" },
    ]

    const filterOptions = [
        { label: "All Exams", value: "all" },
        { label: "Terminal Exams", value: "terminal" },
        { label: "Midterm Exams", value: "midterm" },
        { label: "Final Exams", value: "final" },
        { label: "Unit Tests", value: "unit" },
        { label: "Upcoming", value: "upcoming" },
        { label: "Ongoing", value: "ongoing" },
        { label: "Completed", value: "completed" },
    ]

    const getClassOptions = () => {
        const options = [{ label: "All Classes", value: "all" }]

        if (classData && classData.length > 0) {
            classData.forEach((classItem) => {
                options.push({ label: classItem.name, value: classItem.id })
            })
        } else {
            options.push(
                { label: "Grade 8", value: "Grade 8" },
                { label: "Grade 9", value: "Grade 9" },
                { label: "Grade 10", value: "Grade 10" },
                { label: "Grade 11", value: "Grade 11" },
                { label: "Grade 12", value: "Grade 12" },
            )
        }

        return options
    }

    const [examRoutines, setExamRoutines] = useState<ExamRoutine[]>([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterClass, setFilterClass] = useState("all")
    const [sortOrder, setSortOrder] = useState("date_asc")
    const [addExamOpen, setAddExamOpen] = useState(false)
    const [editExamOpen, setEditExamOpen] = useState(false)
    const [currentExam, setCurrentExam] = useState<ExamRoutine | null>(null)

    // State for storing the fetched class data
    const [classData, setClassData] = useState<ClassData[]>([])
    const [selectedClass, setSelectedClass] = useState<string>("")

    // Define the Zod schema for form validation
    const examFormSchema = z
        .object({
            exam_type: z.string({
                required_error: "Please select an exam type",
            }),
            subject: z.string({
                required_error: "Please select a subject",
            }),
            school_class: z.string({
                required_error: "Please select a class",
            }),
            section: z.string({
                required_error: "Please select a section",
            }),
            exam_date: z.string({
                required_error: "Please select a date",
            }),
            start_time: z.string({
                required_error: "Please select a start time",
            }),
            end_time: z.string({
                required_error: "Please select an end time",
            }),
        })
        .refine(
            (data) => {
                // Convert time strings to Date objects for comparison
                const startTime = new Date(`2000-01-01T${data.start_time}`)
                const endTime = new Date(`2000-01-01T${data.end_time}`)
                return endTime > startTime
            },
            {
                message: "End time must be after start time",
                path: ["end_time"],
            },
        )

    type ExamFormValues = z.infer<typeof examFormSchema>

    const form = useForm<ExamFormValues>({
        resolver: zodResolver(examFormSchema),
        defaultValues: {
            exam_type: "",
            subject: "",
            school_class: "",
            section: "",
            exam_date: "",
            start_time: "",
            end_time: "",
        },
    })

    const watchedClass = form.watch("school_class")

    useEffect(() => {
        if (watchedClass) {
            setSelectedClass(watchedClass)
            form.setValue("section", "")
            form.setValue("subject", "")
        }
    }, [watchedClass, form])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return format(date, "MMMM dd, yyyy")
    }

    const formatTime = (timeString: string) => {
        return timeString
    }

    useEffect(() => {
        fetchExams()
        fetchClassData() // Add this line to fetch class data on component mount
    }, [])

    const fetchExams = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get("/api/academic/exam/")

            const examsWithStatus = response.data.map((exam: ExamRoutine) => {
                const examDate = new Date(exam.exam_date)
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                let status: "upcoming" | "ongoing" | "completed" = "upcoming"
                if (examDate < today) {
                    status = "completed"
                } else if (examDate.getTime() === today.getTime()) {
                    // Check if current time is between start and end time
                    const currentTime = new Date()
                    const startTime = new Date(`${exam.exam_date}T${exam.start_time}`)
                    const endTime = new Date(`${exam.exam_date}T${exam.end_time}`)

                    if (currentTime >= startTime && currentTime <= endTime) {
                        status = "ongoing"
                    } else if (currentTime > endTime) {
                        status = "completed"
                    }
                }

                return { ...exam, status }
            })

            setExamRoutines(examsWithStatus)
        } catch (error) {
            console.error("Error fetching exam data:", error)
            toast.error("Failed to load exam data")
        } finally {
            setLoading(false)
        }
    }

    const fetchClassData = async () => {
        try {
            const response = await axiosInstance.get("/api/academic/exam-form/")
            setClassData(response.data)
        } catch (error) {
            console.error("Error fetching class data:", error)
            toast.error("Failed to load class data")
        }
    }

    const handleDelete = async (id: string) => {
        axiosInstance
            .delete("/api/academic/exam/" + id + "/")
            .then(() => {
                setExamRoutines((prev) => prev.filter((exam) => exam.id !== id))
                toast.success("Exam deleted successfully")
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const handleEdit = (exam: ExamRoutine) => {
        setCurrentExam(exam)
        // Find the class ID that matches the exam's school_class
        const classItem = classData.find((c) => c.name === exam.school_class || c.id === exam.school_class)
        const classId = classItem ? classItem.id : exam.school_class

        setSelectedClass(classId)
        form.reset({
            exam_type: exam.exam_type,
            subject: exam.subject,
            school_class: classId,
            section: "", // You might need to add section to your ExamRoutine interface
            exam_date: exam.exam_date,
            start_time: exam.start_time,
            end_time: exam.end_time,
        })
        setEditExamOpen(true)
    }

    const handleUpdateExam = async (values: ExamFormValues) => {
        try {
            if (!currentExam) return

            // Make the actual API request
            await axiosInstance.put(`/api/academic/exam/${currentExam.id}/`, values)

            // Update the local state
            const updatedExam: ExamRoutine = {
                ...currentExam,
                ...values,
            }

            setExamRoutines((prev) => prev.map((exam) => (exam.id === currentExam.id ? updatedExam : exam)))
            setEditExamOpen(false)
            toast.success("Exam updated successfully")

            // Refresh the exams list to get the latest data
            fetchExams()
        } catch (error) {
            toast.error("Failed to update exam")
            console.error(error)
        }
    }

    const handleAddExam = async (values: ExamFormValues) => {
        axiosInstance
            .post("api/academic/exam/", {
                exam_date: values.exam_date,
                start_time: values.start_time,
                end_time: values.end_time,
                subject: values.subject,
                school_class: values.school_class,
                exam_type: values.exam_type,
                section: values.section,
            })
            .then(() => {
                toast.success("Exam added successfully")
                setAddExamOpen(false)
                fetchExams()
            })
            .catch((error) => {
                console.error("Error adding exam:", error)
            })
    }

    // Filtering logic
    const filteredExams = examRoutines.filter((exam) => {
        const searchMatch =
            exam.subject.toLowerCase().includes(searchText.toLowerCase()) ||
            exam.school_class.toLowerCase().includes(searchText.toLowerCase())

        let typeMatch = true
        if (filterStatus === "terminal") {
            typeMatch = exam.exam_type === "terminal"
        } else if (filterStatus === "midterm") {
            typeMatch = exam.exam_type === "midterm"
        } else if (filterStatus === "final") {
            typeMatch = exam.exam_type === "final"
        } else if (filterStatus === "unit") {
            typeMatch = exam.exam_type === "unit"
        } else if (filterStatus === "upcoming") {
            typeMatch = exam.status === "upcoming"
        } else if (filterStatus === "ongoing") {
            typeMatch = exam.status === "ongoing"
        } else if (filterStatus === "completed") {
            typeMatch = exam.status === "completed"
        }

        let classMatch = true
        if (filterClass !== "all") {
            // Check if we're dealing with a class ID from the API or a grade name
            const selectedClassData = classData.find((c) => c.id === filterClass)

            if (selectedClassData) {
                // If we found a match in classData, we're filtering by class ID
                // The exam.school_class might be storing either the ID or the name
                classMatch =
                    exam.school_class === filterClass ||
                    exam.school_class === selectedClassData.name ||
                    // Also check if the class name is contained within the exam's class field
                    exam.school_class.includes(selectedClassData.name)
            } else {
                // Fallback to the previous logic for backward compatibility
                classMatch = exam.school_class.toLowerCase().includes(filterClass.toLowerCase())
            }
        }

        return searchMatch && typeMatch && classMatch
    })

    // Also add a console log to help debug the filtering
    useEffect(() => {
        if (filterClass !== "all") {
            console.log("Filtering by class:", filterClass)
            console.log("Available classes:", classData)
            console.log("Filtered exams count:", filteredExams.length)
        }
    }, [filterClass, filteredExams.length])

    // Sorting logic
    const sortedExams = [...filteredExams].sort((a, b) => {
        if (sortOrder === "date_asc") return new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
        if (sortOrder === "date_desc") return new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime()
        if (sortOrder === "subject_asc") return a.subject.localeCompare(b.subject)
        if (sortOrder === "subject_desc") return b.subject.localeCompare(a.subject)
        if (sortOrder === "class_asc") return a.school_class.localeCompare(b.school_class)
        if (sortOrder === "class_desc") return b.school_class.localeCompare(a.school_class)
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

    // Get sections for the selected class
    const getSectionsForClass = () => {
        const selectedClassData = classData.find((c) => c.id === selectedClass)
        return selectedClassData?.section || []
    }

    // Get subjects for the selected class
    const getSubjectsForClass = () => {
        const selectedClassData = classData.find((c) => c.id === selectedClass)
        return selectedClassData?.subjects || []
    }

    return (
        <div className="p-4 flex flex-col gap-4 bg-gray-50">
            <div>
                {role === "admin" ? (
                    <PageHeader
                        title="Exam Routines"
                        breadcrumbs={[
                            { label: "Dashboard", href: "/" },
                            { label: "Academics", href: "/academics/" },
                            { label: "Exam Routines", href: "/academics/exam-routines/" },
                        ]}
                        primaryAction={{
                            label: "Add Exam",
                            onClick: () => {
                                form.reset({
                                    exam_type: "",
                                    subject: "",
                                    school_class: "",
                                    section: "",
                                    exam_date: "",
                                    start_time: "",
                                    end_time: "",
                                })
                                // Fetch class data when opening the form
                                fetchClassData()
                                setAddExamOpen(true)
                            },
                            icon: <PlusCircle className="h-4 w-4" />,
                        }}
                    />
                ) : (
                    <PageHeader
                        title="Exam Routines"
                        breadcrumbs={[
                            { label: "Dashboard", href: "/" },
                            { label: "Academics", href: "/academics/" },
                            { label: "Exam Routines", href: "/academics/exam-routines/" },
                        ]}
                    />
                )}
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
                                <SelectValue placeholder="Filter by class" />
                            </SelectTrigger>
                            <SelectContent>
                                {getClassOptions().map((option) => (
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
                            <BookOpen className="h-5 w-5 text-blue-600" />
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
                            <Clock className="h-5 w-5 text-green-600" />
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
                            <FileText className="h-5 w-5 text-gray-600" />
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
                            <TableHead>Status</TableHead>
                            {
                                role == 'admin' ? (
                                    <TableHead className="text-right">Actions</TableHead>
                                ) : null
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-5 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-32" />
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Skeleton className="h-5 w-20" />
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <Skeleton className="h-5 w-28" />
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <Skeleton className="h-5 w-28" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-20" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-9 w-10 ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : sortedExams.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No exam routines found. Add some exams to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedExams.map((exam) => (
                                <TableRow key={exam.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium capitalize">{exam.exam_type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{exam.subject}</TableCell>
                                    <TableCell className="hidden md:table-cell">{exam.school_class}</TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                            <span>{formatDate(exam.exam_date)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                                            <span>
                        {formatTime(exam.start_time)} - {formatTime(exam.end_time)}
                      </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(exam.status || "upcoming")}</TableCell>
                                    {
                                        role == 'admin' ? (
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuItem onClick={() => handleEdit(exam)}>
                                                            <Pencil className="h-4 w-4 mr-2 text-gray-500" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(exam.id)} className="text-red-600">
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        ) : null
                                    }
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
                                    name="exam_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Exam Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select exam type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="terminal">Terminal Exam</SelectItem>
                                                    <SelectItem value="midterm">Midterm Exam</SelectItem>
                                                    <SelectItem value="final">Final Exam</SelectItem>
                                                    <SelectItem value="unit">Unit Test</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="school_class"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select class" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {classData.map((classItem) => (
                                                        <SelectItem key={classItem.id} value={classItem.id}>
                                                            {classItem.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="section"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Section</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchedClass}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select section" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {getSectionsForClass().map((section) => (
                                                        <SelectItem key={section.id} value={section.id}>
                                                            {section.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchedClass}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select subject" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {getSubjectsForClass().map((subject) => (
                                                        <SelectItem key={subject.id} value={subject.id}>
                                                            {subject.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="exam_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="start_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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

            {/* Edit Exam Dialog */}
            <Dialog
                open={editExamOpen}
                onOpenChange={(open) => {
                    setEditExamOpen(open)
                    if (!open) form.reset()
                }}
            >
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Exam</DialogTitle>
                        <DialogDescription>Update the exam details.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleUpdateExam)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="exam_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Exam Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select exam type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="terminal">Terminal Exam</SelectItem>
                                                    <SelectItem value="midterm">Midterm Exam</SelectItem>
                                                    <SelectItem value="final">Final Exam</SelectItem>
                                                    <SelectItem value="unit">Unit Test</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!watchedClass}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select subject" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {getSubjectsForClass().map((subject) => (
                                                        <SelectItem key={subject.id} value={subject.id}>
                                                            {subject.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="school_class"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {classData.map((classItem) => (
                                                    <SelectItem key={classItem.id} value={classItem.id}>
                                                        {classItem.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="section"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Section</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!watchedClass}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select section" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {getSectionsForClass().map((section) => (
                                                    <SelectItem key={section.id} value={section.id}>
                                                        {section.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="exam_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="start_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={() => setEditExamOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Update Exam</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
