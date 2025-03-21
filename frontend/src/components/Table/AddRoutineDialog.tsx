"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const routineFormSchema = z.object({
    school_class: z.string({ required_error: "Class is required" }).min(1, "Class is required"),
    section: z.string({ required_error: "Section is required" }).min(1, "Section is required"),
    subject: z.string({ required_error: "Subject is required" }).min(1, "Subject is required"),
    teacher: z.string({ required_error: "Teacher is required" }).min(1, "Teacher is required"),
    day: z.string({ required_error: "Day is required" }).min(1, "Day is required"),
    start_time: z.string({ required_error: "Start time is required" }).min(1, "Start time is required"),
    end_time: z.string({ required_error: "End time is required" }).min(1, "End time is required"),
}).refine(
    (data) => {
        if (data.start_time && data.end_time) {
            return data.end_time > data.start_time;
        }
        return true;
    },
    {
        message: "End time must be after start time",
        path: ["end_time"],
    }
);

type RoutineFormValues = z.infer<typeof routineFormSchema>

interface RoutineFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editId?: string
    onSuccess: () => void
}

interface Option {
    id: string
    name: string
}

export function RoutineFormDialog({ open, onOpenChange, editId, onSuccess }: RoutineFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [classes, setClasses] = useState<any[]>([])
    const [sections, setSections] = useState<any[]>([])
    const [subjects, setSubjects] = useState<any[]>([])
    const [teachers, setTeachers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedClass, setSelectedClass] = useState<string | null>(null)
    const [selectedSection, setSelectedSection] = useState<string | null>(null)
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


    const form = useForm<RoutineFormValues>({
        resolver: zodResolver(routineFormSchema),
        defaultValues: {
            school_class: "",
            section: "",
            subject: "",
            teacher: "",
            day: "",
            start_time: "",
            end_time: "",
        },
    });

    // Fetch options for dropdowns
    useEffect(() => {
        const fetchOptions = async () => {
            setIsLoading(true)
            try {
                const response = await AxiosInstance.get("/api/academic/routine/add/")
                setClasses(response.data.school_class || [])
            } catch (error) {
                console.error("Error fetching options:", error)
                toast.error("Failed to load form data")
            } finally {
                setIsLoading(false)
            }
        }

        if (open) {
            fetchOptions()
        }
    }, [open])

    // Update sections when class is selected
    useEffect(() => {
        if (!selectedClass) {
            setSections([])
            setSubjects([])
            setTeachers([])
            return
        }

        const selectedClassData = classes.find((c) => c.id === selectedClass)
        if (selectedClassData) {
            setSections(selectedClassData.section || [])
            setSubjects([])
            setTeachers([])

            // Reset dependent fields
            form.setValue("section", "")
            form.setValue("subject", "")
            form.setValue("teacher", "")
        }
    }, [selectedClass, classes, form])

    // Update subjects when section is selected
    useEffect(() => {
        if (!selectedClass) {
            setSubjects([])
            return
        }

        const selectedClassData = classes.find((c) => c.id === selectedClass)
        if (selectedClassData) {
            setSubjects(selectedClassData.subjects || [])
            setTeachers([])

            // Reset dependent fields
            form.setValue("subject", "")
            form.setValue("teacher", "")
        }
    }, [selectedClass, selectedSection, classes, form])

    // Update teachers when subject is selected
    useEffect(() => {
        if (!selectedSubject || !selectedClass) {
            setTeachers([])
            return
        }

        const selectedClassData = classes.find((c) => c.id === selectedClass)
        if (selectedClassData) {
            const selectedSubjectData = selectedClassData.subjects.find((s) => s.id === selectedSubject)
            if (selectedSubjectData) {
                setTeachers(selectedSubjectData.teacher || [])

                // Reset teacher field if current selection is not in the new list
                const currentTeacher = form.getValues("teacher")
                const teacherExists = selectedSubjectData.teacher.some((t) => t.id === currentTeacher)
                if (currentTeacher && !teacherExists) {
                    form.setValue("teacher", "")
                }
            }
        }
    }, [selectedClass, selectedSubject, classes, form])

    // Fetch routine data if editing
    useEffect(() => {
        const fetchRoutineData = async () => {
            if (!editId) return

            setIsLoading(true)
            try {
                const response = await AxiosInstance.get(`/api/academic/routine/${editId}/`)
                const routineData = response.data

                // Set the selected class first to trigger section loading
                setSelectedClass(routineData.school_class.id)

                // We need to wait for the classes to load before setting other values
                setTimeout(() => {
                    setSelectedSection(routineData.section.id)
                    setSelectedSubject(routineData.subject.id)

                    form.reset({
                        school_class: routineData.school_class.id,
                        section: routineData.section.id,
                        subject: routineData.subject.id,
                        teacher: routineData.teacher.id,
                        day: routineData.day,
                        start_time: routineData.start_time,
                        end_time: routineData.end_time,
                    })
                }, 500)
            } catch (error) {
                console.error("Error fetching routine data:", error)
                toast.error("Failed to load routine data")
            } finally {
                setIsLoading(false)
            }
        }

        if (open && editId) {
            fetchRoutineData()
        }
    }, [open, editId, form])

    // Handle form submission
    const onSubmit = async (values: RoutineFormValues) => {
        setIsSubmitting(true);
        console.log("Submitting form:", values);
        try {
            const payload = {
                school_class: values.school_class,
                section: values.section,
                subject: values.subject,
                teacher: values.teacher,
                day: values.day,
                start_time: values.start_time,
                end_time: values.end_time,
            };

            if (editId) {
                await AxiosInstance.put(`/api/academic/routine/${editId}/`, payload);
                toast.success("Routine updated successfully");
            } else {
                await AxiosInstance.post("/api/academic/routine/", payload);
                toast.success("Routine added successfully");
            }

            onSuccess();
            onOpenChange(false);
            form.reset();
        } catch (error: any) {
            console.error("Error submitting form:", error);

            if (error.response?.status === 400) {
                toast.error("Their is schedule conflict with the routine");
            } else

            if (error.response?.data) {
                const apiErrors = error.response.data;

                Object.entries(apiErrors).forEach(([field, errors]) => {
                    if (field in form.formState.errors) {
                        form.setError(field, {
                            type: "manual",
                            message: Array.isArray(errors) ? errors[0] : errors,
                        });
                    }
                });

                toast.error("Please correct the errors in the form");
            } else {
                toast.error("Failed to save routine");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>{editId ? "Edit Routine" : "Add New Routine"}</DialogTitle>
                    <DialogDescription>
                        {editId ? "Update the routine details below." : "Fill in the details to create a new routine."}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="school_class"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Class</FormLabel>
                                            <Select
                                                disabled={isSubmitting}
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    setSelectedClass(value)
                                                    // Reset section when class changes
                                                    form.setValue("section", "")
                                                }}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select class"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {classes.map((classItem) => (
                                                        <SelectItem key={classItem.id} value={classItem.id}>
                                                            {classItem.name}
                                                        </SelectItem>
                                                    ))}
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
                                            <Select
                                                disabled={isSubmitting || !selectedClass}
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    setSelectedSection(value)
                                                }}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={selectedClass ? "Select section" : "Select class first"}/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {sections.map((section) => (
                                                        <SelectItem key={section.id} value={section.id}>
                                                            {section.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <Select
                                                disabled={isSubmitting || !selectedClass}
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    setSelectedSubject(value)
                                                }}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={selectedClass ? "Select subject" : "Select class first"}/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {subjects.map((subject) => (
                                                        <SelectItem key={subject.id} value={subject.id}>
                                                            {subject.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="teacher"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Teacher</FormLabel>
                                            <Select
                                                disabled={isSubmitting || !selectedSubject || teachers.length === 0}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                !selectedClass
                                                                    ? "Select class first"
                                                                    : !selectedSubject
                                                                        ? "Select subject first"
                                                                        : teachers.length === 0
                                                                            ? "No teachers available"
                                                                            : "Select teacher"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {teachers.map((teacher) => (
                                                        <SelectItem key={teacher.id} value={teacher.id}>
                                                            {teacher.first_name} {teacher.last_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="day"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Day</FormLabel>
                                        <Select disabled={isSubmitting} onValueChange={field.onChange}
                                                value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select day"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {days.map((day) => (
                                                    <SelectItem key={day} value={day}>
                                                        {day}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="start_time"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" placeholder="Start time"
                                                       disabled={isSubmitting} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="end_time"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" placeholder="End time"
                                                       disabled={isSubmitting} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}
                                        disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    {editId ? "Update" : "Add"} Routine
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}

