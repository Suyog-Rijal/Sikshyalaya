"use client"

import { useState } from "react"
import { format, isPast, formatDistanceToNow } from "date-fns"
import {
    MoreHorizontal,
    Calendar,
    Users,
    Paperclip,
    Eye,
    Pencil,
    Copy,
    Trash2,
    FileText,
    ChevronDown,
    ChevronUp,
    ToggleLeft,
    ToggleRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    File,
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { Assignment } from "@/views/teacher/TeacherAssignmentList.tsx"

interface AssignmentCardListProps {
    assignments: Assignment[]
    loading: boolean
    onDelete: (id: string) => void
    onDuplicate: (id: string) => void
    onView: (id: string) => void
    onEdit: (id: string) => void
    onToggleStatus: (id: string) => void
}

export function TeacherAssignmentCard({
                                          assignments,
                                          loading,
                                          onDelete,
                                          onDuplicate,
                                          onView,
                                          onEdit,
                                          onToggleStatus,
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
                return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            case "inactive":
                return <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            case "draft":
                return <Clock className="h-3.5 w-3.5 text-blue-500" />
            default:
                return null
        }
    }

    const getFileIcon = (fileType: string) => {
        if (fileType.includes("pdf")) {
            return <FileText className="h-3.5 w-3.5 text-red-500" />
        } else if (fileType.includes("word") || fileType.includes("document")) {
            return <FileText className="h-3.5 w-3.5 text-blue-500" />
        } else if (fileType.includes("sheet") || fileType.includes("excel")) {
            return <FileText className="h-3.5 w-3.5 text-green-500" />
        } else if (fileType.includes("presentation") || fileType.includes("powerpoint")) {
            return <FileText className="h-3.5 w-3.5 text-orange-500" />
        } else {
            return <File className="h-3.5 w-3.5 text-gray-500" />
        }
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-500 mb-4 text-center">
                    There are no assignments matching your current filters. Try adjusting your search or create a new assignment.
                </p>
                <Button>Create New Assignment</Button>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.map((assignment) => {
                    const isExpanded = expandedCards.has(assignment.id)
                    const isPastDue = isPast(new Date(assignment.dueDate))
                    const isActive = assignment.status === "active"

                    return (
                        <Card
                            key={assignment.id}
                            className={cn(
                                "overflow-hidden hover:shadow-md transition-shadow flex flex-col min-h-[320px]",
                                assignment.status === "inactive" && "bg-gray-50 border-gray-200",
                                assignment.status === "draft" && "bg-blue-50 border-blue-200",
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
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onView(assignment.id)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEdit(assignment.id)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit Assignment
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDuplicate(assignment.id)}>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onToggleStatus(assignment.id)}>
                                                {isActive ? (
                                                    <>
                                                        <ToggleLeft className="mr-2 h-4 w-4" />
                                                        Deactivate
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleRight className="mr-2 h-4 w-4" />
                                                        Activate
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => confirmDelete(assignment.id)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                        {assignment.subject.name}
                                    </Badge>
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                                        {assignment.class.name} {assignment.section?.name}
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
                                            className={cn(
                                                "text-gray-600",
                                                isPastDue && assignment.status === "active" && "text-red-600 font-medium",
                                            )}
                                        >
                      Due: {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                                            {isPastDue && assignment.status === "active" && (
                                                <span className="ml-1 text-xs text-red-600">
                          (Overdue by {formatDistanceToNow(new Date(assignment.dueDate))})
                        </span>
                                            )}
                    </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Users className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                        <span className="text-gray-600">
                      Submissions: {assignment.submissionCount}/{assignment.totalStudents}
                    </span>
                                    </div>
                                    {assignment.attachments.length > 0 && (
                                        <div className="flex flex-col text-sm mt-1">
                                            <div className="flex items-center">
                                                <Paperclip className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                                <span className="text-gray-600">
                          {assignment.attachments.length} attachment{assignment.attachments.length !== 1 ? "s" : ""}
                        </span>
                                            </div>
                                            {isExpanded && (
                                                <div className="ml-6 mt-1">
                                                    {assignment.attachments.map((attachment) => (
                                                        <TooltipProvider key={attachment.id}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <a
                                                                        href={attachment.url}
                                                                        className="flex items-center text-xs text-blue-600 hover:underline mb-1"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        {getFileIcon(attachment.type)}
                                                                        <span className="ml-1 truncate max-w-[200px]">{attachment.name}</span>
                                                                    </a>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{attachment.name}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2 border-t">
                                <div className="flex items-center text-xs text-gray-500">
                                    {getStatusIcon(assignment.status)}
                                    <span className="ml-1">Created: {format(new Date(assignment.createdAt), "MMM d, yyyy")}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => onEdit(assignment.id)} className="h-8">
                                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                                    </Button>
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
