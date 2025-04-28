"use client"

import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Clock, User, Search, Download, Eye } from "lucide-react"
import { format } from "date-fns"
import {Link} from "react-router-dom";

export default function AssignmentPage() {
    const [loading, setLoading] = useState(true)
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([])
    const [selectedClass, setSelectedClass] = useState("all")
    const [selectedSection, setSelectedSection] = useState("all")
    const [selectedSubject, setSelectedSubject] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [classes] = useState([
        { id: "class1", name: "Class 1" },
        { id: "class2", name: "Class 2" },
        { id: "class3", name: "Class 3" },
    ])
    const [sections] = useState([
        { id: "secA", name: "Section A" },
        { id: "secB", name: "Section B" },
        { id: "secC", name: "Section C" },
    ])
    const [subjects] = useState([
        { id: "sub1", name: "Mathematics" },
        { id: "sub2", name: "Science" },
        { id: "sub3", name: "English" },
        { id: "sub4", name: "History" },
    ])

    // Mock data for assignments
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockAssignments: Assignment[] = [
                {
                    id: "a1",
                    title: "Algebra Equations Worksheet",
                    class: { id: "class1", name: "Class 1" },
                    section: { id: "secA", name: "Section A" },
                    subject: { id: "sub1", name: "Mathematics" },
                    status: "active",
                    description: "Complete all the algebra equations in the attached worksheet. Show your work for each problem.",
                    file: {
                        name: "algebra_worksheet.pdf",
                        url: "#",
                    },
                    uploadedAt: new Date("2023-04-10T09:30:00"),
                    dueDate: new Date("2023-04-17T23:59:59"),
                    totalSubmissions: 18,
                    teacher: { id: "t1", name: "John Smith" },
                },
                {
                    id: "a2",
                    title: "Science Lab Report",
                    class: { id: "class2", name: "Class 2" },
                    section: { id: "secB", name: "Section B" },
                    subject: { id: "sub2", name: "Science" },
                    status: "active",
                    description: "Write a detailed lab report on the photosynthesis experiment conducted in class.",
                    file: null,
                    uploadedAt: new Date("2023-04-12T14:15:00"),
                    dueDate: new Date("2023-04-19T23:59:59"),
                    totalSubmissions: 12,
                    teacher: { id: "t2", name: "Emily Johnson" },
                },
                {
                    id: "a3",
                    title: "Essay on Shakespeare",
                    class: { id: "class3", name: "Class 3" },
                    section: { id: "secC", name: "Section C" },
                    subject: { id: "sub3", name: "English" },
                    status: "inactive",
                    description: "Write a 1000-word essay analyzing the themes in Shakespeare's Macbeth.",
                    file: {
                        name: "essay_guidelines.docx",
                        url: "#",
                    },
                    uploadedAt: new Date("2023-03-25T10:00:00"),
                    dueDate: new Date("2023-04-05T23:59:59"),
                    totalSubmissions: 22,
                    teacher: { id: "t3", name: "Robert Williams" },
                },
                {
                    id: "a4",
                    title: "World War II Research Project",
                    class: { id: "class2", name: "Class 2" },
                    section: { id: "secA", name: "Section A" },
                    subject: { id: "sub4", name: "History" },
                    status: "active",
                    description:
                        "Research and present on a specific aspect of World War II. Include at least 5 reliable sources.",
                    file: {
                        name: "ww2_project_rubric.pdf",
                        url: "#",
                    },
                    uploadedAt: new Date("2023-04-08T11:45:00"),
                    dueDate: new Date("2023-04-22T23:59:59"),
                    totalSubmissions: 8,
                    teacher: { id: "t4", name: "Sarah Thompson" },
                },
                {
                    id: "a5",
                    title: "Geometry Problems Set",
                    class: { id: "class1", name: "Class 1" },
                    section: { id: "secB", name: "Section B" },
                    subject: { id: "sub1", name: "Mathematics" },
                    status: "draft",
                    description: "Solve the attached geometry problems. Include diagrams where necessary.",
                    file: {
                        name: "geometry_problems.pdf",
                        url: "#",
                    },
                    uploadedAt: new Date("2023-04-14T08:30:00"),
                    dueDate: new Date("2023-04-24T23:59:59"),
                    totalSubmissions: 0,
                    teacher: { id: "t1", name: "John Smith" },
                },
                {
                    id: "a6",
                    title: "Chemistry Periodic Table Quiz",
                    class: { id: "class3", name: "Class 3" },
                    section: { id: "secB", name: "Section B" },
                    subject: { id: "sub2", name: "Science" },
                    status: "inactive",
                    description:
                        "Study the periodic table for an upcoming quiz. Focus on the first 20 elements and their properties.",
                    file: null,
                    uploadedAt: new Date("2023-04-13T13:20:00"),
                    dueDate: new Date("2023-04-20T23:59:59"),
                    totalSubmissions: 15,
                    teacher: { id: "t5", name: "Michael Brown" },
                },
            ]

            setAssignments(mockAssignments)
            setFilteredAssignments(mockAssignments)
            setLoading(false)
        }, 1000)
    }, [])

    // Filter assignments based on selected filters
    useEffect(() => {
        let filtered = [...assignments]

        if (selectedClass !== "all") {
            filtered = filtered.filter((assignment) => assignment.class.id === selectedClass)
        }

        if (selectedSection !== "all") {
            filtered = filtered.filter((assignment) => assignment.section.id === selectedSection)
        }

        if (selectedSubject !== "all") {
            filtered = filtered.filter((assignment) => assignment.subject.id === selectedSubject)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (assignment) =>
                    assignment.title.toLowerCase().includes(query) ||
                    assignment.teacher.name.toLowerCase().includes(query) ||
                    assignment.description.toLowerCase().includes(query),
            )
        }

        setFilteredAssignments(filtered)
    }, [assignments, selectedClass, selectedSection, selectedSubject, searchQuery])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            case "draft":
                return <Badge variant="outline">Draft</Badge>
            case "inactive":
                return <Badge variant="secondary">Inactive</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <PageHeader
                title="Assignments"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Assignments", href: "/assignment/list" },
                ]}
                // No primary action for admin
            />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search assignments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Classes" />
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

                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Sections" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sections</SelectItem>
                            {sections.map((section) => (
                                <SelectItem key={section.id} value={section.id}>
                                    {section.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Subjects" />
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
                </div>
            </div>

            {/* Assignment Cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(6)
                        .fill(0)
                        .map((_, index) => (
                            <Card key={index} className="animate-pulse">
                                <CardHeader className="pb-2">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </CardContent>
                                <CardFooter>
                                    <div className="h-5 bg-gray-200 rounded w-full"></div>
                                </CardFooter>
                            </Card>
                        ))}
                </div>
            ) : filteredAssignments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAssignments.map((assignment) => (
                        <Card key={assignment.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                                    {getStatusBadge(assignment.status)}
                                </div>
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                                    <span>{assignment.class.name}</span>
                                    <span>•</span>
                                    <span>{assignment.section.name}</span>
                                    <span>•</span>
                                    <span>{assignment.subject.name}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <p className="text-sm mb-4 line-clamp-2">{assignment.description}</p>

                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">Teacher:</span>
                                    </div>
                                    <div>{assignment.teacher.name}</div>

                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">Due Date:</span>
                                    </div>
                                    <div>{format(assignment.dueDate, "MMM d, yyyy")}</div>

                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">Uploaded:</span>
                                    </div>
                                    <div>{format(assignment.uploadedAt, "MMM d, yyyy")}</div>

                                    <div className="flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">Submissions:</span>
                                    </div>
                                    <div>{assignment.totalSubmissions}</div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2 border-t">
                                {assignment.file ? (
                                    <Button variant="outline" size="sm" className="gap-1.5">
                                        <Download className="h-3.5 w-3.5" />
                                        {assignment.file.name.length > 20
                                            ? `${assignment.file.name.substring(0, 17)}...`
                                            : assignment.file.name}
                                    </Button>
                                ) : (
                                    <span className="text-sm text-muted-foreground">No file attached</span>
                                )}
                                <Link to={`/assignment/detail/${assignment.id}`} className="gap-1.5 flex justify-center items-center p-1 rounded-md outline-zinc-200 outline-1">
                                    <Eye className="h-3.5 w-3.5" />
                                    View Details
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No assignments found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your filters or search criteria</p>
                </div>
            )}
        </div>
    )
}

// Types
interface Assignment {
    id: string
    title: string
    class: {
        id: string
        name: string
    }
    section: {
        id: string
        name: string
    }
    subject: {
        id: string
        name: string
    }
    status: string
    description: string
    file: {
        name: string
        url: string
    } | null
    uploadedAt: Date
    dueDate: Date
    totalSubmissions: number
    teacher: {
        id: string
        name: string
    }
}
