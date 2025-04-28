"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Upload, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// Sample data for dropdowns - replace with your actual data
const classes = [
    { id: "class-9", name: "Class 9" },
    { id: "class-10", name: "Class 10" },
    { id: "class-11", name: "Class 11" },
    { id: "class-12", name: "Class 12" },
]

const sections = [
    { id: "section-a", name: "Section A" },
    { id: "section-b", name: "Section B" },
    { id: "section-c", name: "Section C" },
]

const subjects = [
    { id: "math-101", name: "Mathematics" },
    { id: "sci-102", name: "Science" },
    { id: "eng-103", name: "English" },
    { id: "hist-104", name: "History" },
    { id: "cs-105", name: "Computer Science" },
    { id: "geo-106", name: "Geography" },
]

interface CreateAssignmentDialogProps {
    onAssignmentCreated?: (assignment: any) => void
    trigger?: React.ReactNode
}

export function CreateAssignmentDialog({ onAssignmentCreated, trigger }: CreateAssignmentDialogProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        classId: "",
        sectionId: "",
        subjectId: "",
        title: "",
        description: "",
        dueDate: new Date(),
    })
    const [files, setFiles] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setFormData((prev) => ({ ...prev, dueDate: date }))
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setFiles((prev) => [...prev, ...newFiles])
        }
    }

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Validate form
            if (!formData.classId || !formData.sectionId || !formData.subjectId || !formData.title || !formData.dueDate) {
                toast.error("Please fill all required fields")
                setIsSubmitting(false)
                return
            }

            // In a real application, you would submit to your API
            // const formDataToSubmit = new FormData()
            // Object.entries(formData).forEach(([key, value]) => {
            //   formDataToSubmit.append(key, value.toString())
            // })
            // files.forEach((file) => {
            //   formDataToSubmit.append('files', file)
            // })
            // const response = await AxiosInstance.post('/api/academic/assignments/', formDataToSubmit)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Create a new assignment object
            const newAssignment = {
                id: `assignment-${Date.now()}`,
                title: formData.title,
                description: formData.description,
                subject: subjects.find((s) => s.id === formData.subjectId) || subjects[0],
                class: classes.find((c) => c.id === formData.classId) || classes[0],
                dueDate: formData.dueDate.toISOString(),
                status: "assigned",
                submissionCount: 0,
                totalStudents: 30, // This would come from your API
                createdAt: new Date().toISOString(),
                attachments: files.length,
            }

            // Call the callback function if provided
            if (onAssignmentCreated) {
                onAssignmentCreated(newAssignment)
            }

            toast.success("Assignment created successfully")

            // Reset form and close dialog
            setFormData({
                classId: "",
                sectionId: "",
                subjectId: "",
                title: "",
                description: "",
                dueDate: new Date(),
            })
            setFiles([])
            setOpen(false)
        } catch (error) {
            console.error("Error creating assignment:", error)
            toast.error("Failed to create assignment")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || <Button>Create Assignment</Button>}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Assignment</DialogTitle>
                    <DialogDescription>Fill in the details below to create a new assignment for your students.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="class">
                                Class <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.classId} onValueChange={(value) => handleSelectChange("classId", value)}>
                                <SelectTrigger id="class">
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="section">
                                Section <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.sectionId} onValueChange={(value) => handleSelectChange("sectionId", value)}>
                                <SelectTrigger id="section">
                                    <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sections.map((section) => (
                                        <SelectItem key={section.id} value={section.id}>
                                            {section.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">
                            Subject <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.subjectId} onValueChange={(value) => handleSelectChange("subjectId", value)}>
                            <SelectTrigger id="subject">
                                <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter assignment title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter assignment description"
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">
                            Due Date <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !formData.dueDate && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={formData.dueDate} onSelect={handleDateChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="files">Attachments (Optional)</Label>
                        <div className="flex items-center gap-2">
                            <Input id="files" type="file" onChange={handleFileChange} className="hidden" multiple />
                            <Label
                                htmlFor="files"
                                className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent"
                            >
                                <Upload className="h-4 w-4" />
                                <span>Upload Files</span>
                            </Label>
                            <span className="text-sm text-muted-foreground">{files.length} file(s) selected</span>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-accent/50 p-2 rounded-md">
                    <span className="text-sm truncate max-w-[400px]">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Assignment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
