"use client"

import { useState } from "react"
import { format, isPast, formatDistanceToNow } from "date-fns"
import {
    MoreHorizontal,
    Calendar,
    Users,
    Eye,
    Pencil,
    Trash2,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    AlertCircle,
    BookOpen,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Assignment {
    id: string
    title: string
    description: string
    due_date: string // ISO 8601 date format
    subject: {
        id: string
        name: string
    }
    school_class: {
        id: string
        name: string
    }
    section: {
        name: string | null
    }
    is_active: boolean
    total_students: number
    total_submissions: number
}

interface AssignmentCardListProps {
    assignments: Assignment[]
    loading: boolean
    onDelete: (id: string) => void
    onDuplicate: (id: string) => void
    onView: (id: string) => void
    onEdit: (id: string) => void
    onToggleStatus: (id: string) => void
    role?: string
}

export function TeacherAssignmentCard({
                                          assignments,
                                          loading,
                                          onDelete,
                                          onView,
                                          onEdit,
                                          role,
                                      }: AssignmentCardListProps) {
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null)

    const toggleCardExpansion = (id: string) => {
        const newExpandedCards = new Set(expandedCards)
        if (expandedCards.has(id)) {
            newExpandedCards.delete(id)
        } else {
            newExpandedCards.add(id)
        }
        setExpandedCards(newExpandedCards)
    }

    const confirmDelete = (id: string) => {
        setAssignmentToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (assignmentToDelete) {
            onDelete(assignmentToDelete)
            setDeleteDialogOpen(false)
            setAssignmentToDelete(null)
        }
    }

    const getStatusIcon = (isActive: boolean, isPastDue: boolean) => {
        if (!isActive) {
            return <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
        }
        if (isPastDue) {
            return <AlertCircle className="h-3.5 w-3.5 text-red-500" />
        }
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
    }

    const getSubmissionProgress = (assignment: Assignment) => {
        if (assignment.total_students === 0) return 0
        return Math.round((assignment.total_submissions / assignment.total_students) * 100)
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden flex flex-col min-h-[320px] animate-pulse">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6 mb-2" />
                            <Skeleton className="h-4 w-4/6" />
                            <div className="mt-4">
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-4 w-40 mb-2" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    if (assignments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 min-h-[320px]">
                <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-500 mb-4 text-center">
                    There are no assignments matching your current filters. Try adjusting your search or create a new assignment.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.map((assignment) => {
                    const isExpanded = expandedCards.has(assignment.id)
                    const isPastDue = isPast(new Date(assignment.due_date))
                    const submissionProgress = getSubmissionProgress(assignment)

                    return (
                        <Card
                            key={assignment.id}
                            className={cn(
                                "overflow-hidden hover:shadow-md transition-shadow flex flex-col min-h-[320px]",
                                !assignment.is_active && "bg-gray-50 border-gray-200",
                            )}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div
                                        className="font-medium text-lg line-clamp-2 hover:line-clamp-none cursor-pointer"
                                        onClick={() => toggleCardExpansion(assignment.id)}
                                    >
                                        {assignment.title}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onView(assignment.id)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>
                                            {
                                                role == "teacher" ? (
                                                    <>
                                                        <DropdownMenuItem onClick={() => onEdit(assignment.id)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => confirmDelete(assignment.id)}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </>
                                                ) : null
                                            }
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                        {assignment.subject.name}
                                    </Badge>
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                                        {assignment.school_class.name}
                                        {assignment.section?.name ? ` - ${assignment.section.name}` : ""}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2 flex-grow">
                                <p className={cn("text-gray-600 text-sm", isExpanded ? "" : "line-clamp-2")}>
                                    {assignment.description}
                                </p>
                                {!isExpanded && assignment.description.length > 150 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs p-0 h-auto mt-1 flex items-center gap-1"
                                        onClick={() => toggleCardExpansion(assignment.id)}
                                    >
                                        Show more <ChevronDown className="h-3 w-3" />
                                    </Button>
                                )}
                                {isExpanded && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs p-0 h-auto mt-1 flex items-center gap-1"
                                        onClick={() => toggleCardExpansion(assignment.id)}
                                    >
                                        Show less <ChevronUp className="h-3 w-3" />
                                    </Button>
                                )}
                                <div className="flex flex-col gap-1 mt-3">
                                    <div className="flex items-center text-sm">
                                        <Calendar className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                        <span
                                            className={cn("text-gray-600", isPastDue && assignment.is_active && "text-red-600 font-medium")}
                                        >
                      Due: {format(new Date(assignment.due_date), "MMM d, yyyy")}
                                            {isPastDue && assignment.is_active && (
                                                <span className="ml-1 text-xs text-red-600">
                          (Overdue by {formatDistanceToNow(new Date(assignment.due_date))})
                        </span>
                                            )}
                    </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Users className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                        <span className="text-gray-600">
                      Submissions: {assignment.total_submissions}/{assignment.total_students} ({submissionProgress}%)
                    </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2 border-t">
                                <div className="flex items-center text-xs text-gray-500">
                                    {getStatusIcon(assignment.is_active, isPastDue)}
                                    <span className="ml-1">{assignment.is_active ? (isPastDue ? "Overdue" : "Active") : "Inactive"}</span>
                                </div>
                                <div className="flex gap-2">
                                    {
                                        role == "teacher" ? (
                                            <Button size="sm" variant="ghost" onClick={() => onEdit(assignment.id)} className="h-8">
                                                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                                            </Button>
                                        ) : null
                                    }
                                    <Button variant={"outline"} size="sm" onClick={() => onView(assignment.id)} className="h-8">
                                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this assignment? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
