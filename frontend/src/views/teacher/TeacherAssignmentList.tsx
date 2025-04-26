"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/ListPage/PageHeader"
import { toast } from "sonner"
import { PlusCircle, Filter } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {TeacherAssignmentCard} from "@/views/teacher/TeacherAssignmentCard.tsx";

// Assignment interface
export interface Assignment {
    id: string
    title: string
    description: string
    subject: {
        id: string
        name: string
    }
    class: {
        id: string
        name: string
    }
    dueDate: string
    status: "assigned" | "submitted" | "graded"
    submissionCount: number
    totalStudents: number
    createdAt: string
    attachments: number
}

// Dummy data for assignments
const dummyAssignments: Assignment[] = [
    {
        id: "1",
        title: "Mathematics Problem Set: Algebra Fundamentals",
        description: "Complete problems 1-20 in Chapter 3. Show all work and explain your reasoning for each step.",
        subject: {
            id: "math-101",
            name: "Mathematics",
        },
        class: {
            id: "class-10a",
            name: "Class 10-A",
        },
        dueDate: "2025-05-10T23:59:59Z",
        status: "submitted",
        submissionCount: 18,
        totalStudents: 25,
        createdAt: "2025-05-01T10:30:00Z",
        attachments: 2,
    },
    {
        id: "2",
        title: "Science Lab Report: Photosynthesis Experiment",
        description:
            "Write a detailed lab report on the photosynthesis experiment conducted in class. Include hypothesis, methodology, results, and conclusion.",
        subject: {
            id: "sci-102",
            name: "Science",
        },
        class: {
            id: "class-9b",
            name: "Class 9-B",
        },
        dueDate: "2025-05-15T23:59:59Z",
        status: "assigned",
        submissionCount: 5,
        totalStudents: 30,
        createdAt: "2025-05-03T14:15:00Z",
        attachments: 1,
    },
    {
        id: "3",
        title: "English Literature Essay: Shakespeare's Macbeth",
        description:
            "Write a 1000-word analytical essay on the theme of ambition in Shakespeare's Macbeth. Use textual evidence to support your arguments.",
        subject: {
            id: "eng-103",
            name: "English",
        },
        class: {
            id: "class-11c",
            name: "Class 11-C",
        },
        dueDate: "2025-05-20T23:59:59Z",
        status: "graded",
        submissionCount: 22,
        totalStudents: 22,
        createdAt: "2025-04-28T09:45:00Z",
        attachments: 0,
    },
    {
        id: "4",
        title: "History Research Project: Ancient Civilizations",
        description:
            "Research and create a presentation on one ancient civilization of your choice. Cover aspects such as governance, culture, achievements, and legacy.",
        subject: {
            id: "hist-104",
            name: "History",
        },
        class: {
            id: "class-10b",
            name: "Class 10-B",
        },
        dueDate: "2025-05-25T23:59:59Z",
        status: "assigned",
        submissionCount: 0,
        totalStudents: 28,
        createdAt: "2025-05-04T11:20:00Z",
        attachments: 3,
    },
    {
        id: "5",
        title: "Computer Science Programming Assignment: Algorithms",
        description:
            "Implement the sorting algorithms discussed in class (bubble sort, insertion sort, and selection sort) and compare their performance with different input sizes.",
        subject: {
            id: "cs-105",
            name: "Computer Science",
        },
        class: {
            id: "class-12a",
            name: "Class 12-A",
        },
        dueDate: "2025-05-12T23:59:59Z",
        status: "submitted",
        submissionCount: 15,
        totalStudents: 20,
        createdAt: "2025-05-02T13:10:00Z",
        attachments: 1,
    },
    {
        id: "6",
        title: "Geography Project: Climate Change Impact",
        description:
            "Create a detailed report on the impact of climate change on a specific region of your choice. Include data, charts, and proposed solutions.",
        subject: {
            id: "geo-106",
            name: "Geography",
        },
        class: {
            id: "class-11a",
            name: "Class 11-A",
        },
        dueDate: "2025-05-30T23:59:59Z",
        status: "assigned",
        submissionCount: 8,
        totalStudents: 26,
        createdAt: "2025-04-30T15:45:00Z",
        attachments: 2,
    },
]

export default function TeacherAssignmentList() {
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [subjectFilter, setSubjectFilter] = useState<string>("all")
    const [classFilter, setClassFilter] = useState<string>("all")
    const navigate = useNavigate()

    useEffect(() => {
        fetchAssignments()
    }, [])

    const fetchAssignments = async () => {
        setLoading(true)
        try {
            // In a real application, you would fetch from your API
            // const response = await AxiosInstance.get('/api/academic/assignments/')
            // setAssignments(response.data)

            // Using dummy data for now
            setTimeout(() => {
                setAssignments(dummyAssignments)
                setLoading(false)
            }, 800)
        } catch (error) {
            console.error("Error fetching assignments:", error)
            toast.error("Failed to load assignments. Please try again.")
            setLoading(false)
        }
    }

    // Filter assignments based on search query and filters
    const filteredAssignments = assignments.filter((assignment) => {
        const matchesSearch =
            assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || assignment.status === statusFilter

        const matchesSubject = subjectFilter === "all" || assignment.subject.id === subjectFilter

        const matchesClass = classFilter === "all" || assignment.class.id === classFilter

        return matchesSearch && matchesStatus && matchesSubject && matchesClass
    })

    // Get unique subjects and classes for filters
    const subjects = [...new Map(assignments.map((item) => [item.subject.id, item.subject])).values()]
    const classes = [...new Map(assignments.map((item) => [item.class.id, item.class])).values()]

    const handleDeleteAssignment = async (id: string) => {
        try {
            // In a real application, you would call your API
            // await AxiosInstance.delete(`/api/academic/assignments/${id}/`)

            // Update local state
            setAssignments(assignments.filter((assignment) => assignment.id !== id))
            toast.success("Assignment deleted successfully")
        } catch (error) {
            console.error("Error deleting assignment:", error)
            toast.error("Failed to delete assignment")
        }
    }

    const handleDuplicateAssignment = async (id: string) => {
        try {
            const assignmentToDuplicate = assignments.find((assignment) => assignment.id === id)
            if (assignmentToDuplicate) {
                const newAssignment = {
                    ...assignmentToDuplicate,
                    id: `${Date.now()}`,
                    title: `Copy of ${assignmentToDuplicate.title}`,
                    createdAt: new Date().toISOString(),
                    status: "assigned" as const,
                    submissionCount: 0,
                }

                // In a real application, you would call your API
                // const response = await AxiosInstance.post('/api/academic/assignments/', newAssignment)
                // const createdAssignment = response.data

                // Update local state
                setAssignments([newAssignment, ...assignments])
                toast.success("Assignment duplicated successfully")
            }
        } catch (error) {
            console.error("Error duplicating assignment:", error)
            toast.error("Failed to duplicate assignment")
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <PageHeader
                title="Teacher Assignments"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Teacher", href: "/teacher" },
                    { label: "Assignments", href: "/teacher/assignments" },
                ]}
                onRefresh={fetchAssignments}
                onPrint={() => console.log("Printing...")}
                onExport={() => console.log("Exporting...")}
                primaryAction={{
                    label: "Create Assignment",
                    onClick: () => navigate("/teacher/assignments/create"),
                    icon: <PlusCircle className="h-4 w-4" />,
                }}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
                <div className="relative w-full sm:w-[300px]">
                    <Input
                        type="search"
                        placeholder="Search assignments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="graded">Graded</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" className="h-10 w-10">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <TeacherAssignmentCard
                assignments={filteredAssignments}
                loading={loading}
                onDelete={handleDeleteAssignment}
                onDuplicate={handleDuplicateAssignment}
                onView={(id) => navigate(`/assignment/detail/${id}`)}
                onEdit={(id) => navigate(`/assignments/${id}/edit`)}
            />
        </div>
    )
}
