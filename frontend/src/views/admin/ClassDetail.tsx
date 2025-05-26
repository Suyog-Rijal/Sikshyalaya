"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/ListPage/PageHeader.tsx"
import {Users, UserPlus, School, GraduationCap, EllipsisVertical} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import axiosInstance from "@/auth/AxiosInstance.ts"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


// Types for the API response
interface House {
    id: string
    color: string
}

interface ClassTeacher {
    id: string
    profile_picture: string
    email: string
    phone: string
}

interface Section {
    id: string
    name: string
    class_teacher: ClassTeacher | null
    student_count: number
    house: House[]
}

interface ClassData {
    id: string
    name: string
    section: Section[]
}

interface Teacher {
    id: string
    full_name: string
    subject: string
}

export function ClassDetailPage() {
    const navigate = useNavigate()
    const params = useParams()
    const classId = params.id

    const [loading, setLoading] = useState(true)
    const [classData, setClassData] = useState<ClassData | null>(null)
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [selectedTeacher, setSelectedTeacher] = useState<string>("")
    const [selectedSection, setSelectedSection] = useState<string>("")

    useEffect(() => {
        setLoading(true)
        AxiosInstance.get(`/api/academic/class/${classId}/`)
            .then((response) => {
                setClassData(response.data)
            })
            .catch((error) => {
                console.error(error)
                toast.error("Failed to fetch class details")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [classId])

    const assignTeacher = () => {
        if (!selectedTeacher || !selectedSection) {
            return
        }

        AxiosInstance.post(`/api/academic/class-teacher/${classId}/`, {
            teacher_id: selectedTeacher,
            section_id: selectedSection,
        })
            .then(() => {
                toast.success("Teacher assigned successfully")
                AxiosInstance.get(`/api/academic/class/${classId}/`).then((response) => {
                    setClassData(response.data)
                })
                setSelectedTeacher("")
                setSelectedSection("")
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const fetchTeachers = () => {
        axiosInstance
            .get(`/api/academic/class-teacher/${classId}/`)
            .then((res) => {
                setTeachers(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const removeTeacher = (sectionId: string) => {
        AxiosInstance.delete(`/api/academic/class-teacher/${classId}/`, {
            data: {
                section_id: sectionId,
            },
        })
            .then(() => {
                toast.success("Teacher removed successfully")
                AxiosInstance.get(`/api/academic/class/${classId}/`).then((response) => {
                    setClassData(response.data)
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    if (loading) {
        return (
            <div className="p-8 bg-slate-50 min-h-screen">
                <Skeleton className="h-14 w-72 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-80 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (!classData) {
        return (
            <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
                <div className="text-center bg-white p-10 rounded-xl shadow-md border border-slate-100 max-w-md">
                    <School className="h-16 w-16 mx-auto text-slate-300" />
                    <h2 className="text-2xl font-semibold text-slate-700 mt-6">No data found</h2>
                    <p className="text-slate-500 mt-3">Unable to load class information</p>
                    <Button className="mt-6 bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/classes/list/")}>
                        Back to Classes
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <PageHeader
                title={`Class ${classData.name}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Classes", href: "/classes/list/" },
                    { label: `Class ${classData.name}`, href: `/class/${params.id}` },
                ]}
            />

            {/* Sections Grid or No Sections Message */}
            {classData.section.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-md border border-slate-100">
                    <School className="h-16 w-16 mx-auto text-slate-300" />
                    <h3 className="mt-6 text-xl font-semibold text-slate-700">No sections found</h3>
                    <p className="mt-2 text-slate-500 max-w-md mx-auto">Add a section to start managing this class.</p>
                    <Button className="mt-6 bg-blue-600 hover:bg-blue-700">Add Section</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {classData.section.map((section) => (
                        <Card
                            key={section.id}
                            className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-xl"
                        >
                            <CardHeader className=" pb-4 border-b">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-800">Section {section.name}</CardTitle>
                                        <CardDescription className="flex items-center mt-1 text-gray-600">
                                            <Users className="h-4 w-4 mr-1.5" />
                                            {section.student_count} {section.student_count === 1 ? "Student" : "Students"}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2 flex-wrap justify-end">
                                        {section.house.map((house) => (
                                            <Badge
                                                key={house.id}
                                                className={`
              font-medium px-2.5 py-1 rounded-full
              ${house.color.toLowerCase() === "red" ? "bg-red-100 text-red-700 border-red-200" : ""}
              ${house.color.toLowerCase() === "blue" ? "bg-blue-100 text-blue-700 border-blue-200" : ""}
              ${house.color.toLowerCase() === "green" ? "bg-green-100 text-green-700 border-green-200" : ""}
              ${house.color.toLowerCase() === "yellow" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : ""}
              ${!["red", "blue", "green", "yellow"].includes(house.color.toLowerCase()) ? "bg-gray-100 text-gray-700 border-gray-200" : ""}
            `}
                                            >
                                                {house.color} House
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="">
                                <div className="rounded-xl shadow-inner">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center">
                                        <GraduationCap className="h-4 w-4 mr-1.5" />
                                        Class Teacher
                                    </h3>
                                    {section.class_teacher ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-16 w-16 border-2 border-white shadow-md ring-2 ring-blue-100">
                                                    <AvatarImage
                                                        src={section.class_teacher.profile_picture || "/placeholder.svg"}
                                                        alt="Teacher"
                                                    />
                                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                                        <GraduationCap className="h-6 w-6" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-gray-800 text-base">
                                                        {section.class_teacher.email.split("@")[0]}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-0.5">{section.class_teacher.email}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{section.class_teacher.phone}</p>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem className={'p-0'}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full outline-none border-none text-red-600 hover:text-red-600"
                                                            onClick={() => removeTeacher(section.id)}>
                                                            Remove
                                                        </Button>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-md">
                                                    <School className="h-7 w-7 text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 italic">No teacher assigned</p>
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button onClick={fetchTeachers} size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                                                        <UserPlus className="h-4 w-4 mr-1.5" />
                                                        Assign
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>Assign Teacher to Section {section.name}</DialogTitle>
                                                        <DialogDescription>
                                                            Select a teacher to assign as class teacher for Section {section.name}.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <label htmlFor="teacher" className="text-sm font-medium">
                                                                Teacher
                                                            </label>
                                                            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select teacher" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {teachers.map((teacher) => (
                                                                        <SelectItem key={teacher.id} value={teacher.id}>
                                                                            {teacher.full_name} - {teacher.subject}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedSection(section.id)
                                                                assignTeacher()
                                                            }}
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Assign Teacher
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
