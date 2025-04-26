"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Calendar, Users, Paperclip, Eye, Pencil, Copy, Trash2 } from 'lucide-react'
import { format, isPast } from "date-fns"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Assignment} from "@/views/teacher/TeacherAssignmentList.tsx";

interface AssignmentCardListProps {
    assignments: Assignment[]
    loading: boolean
    onDelete: (id: string) => void
    onDuplicate: (id: string) => void
    onView: (id: string) => void
    onEdit: (id: string) => void
}

export function TeacherAssignmentCard({
                                       assignments,
                                       loading,
                                       onDelete,
                                       onDuplicate,
                                       onView,
                                       onEdit,
                                   }: AssignmentCardListProps) {
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

    const toggleCardExpansion = (id: string) => {
        const newExpandedCards = new Set(expandedCards)
        if (expandedCards.has(id)) {
            newExpandedCards.delete(id)
        } else {
            newExpandedCards.add(id)
        }
        setExpandedCards(newExpandedCards)
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6 mb-2" />
                            <Skeleton className="h-4 w-4/6" />
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
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-500 mb-4 text-center">
                    There are no assignments matching your current filters. Try adjusting your search or create a new assignment.
                </p>
                <Button variant="outline">Create New Assignment</Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment) => {
                const isExpanded = expandedCards.has(assignment.id)
                const isPastDue = isPast(new Date(assignment.dueDate))

                return (
                    <Card key={assignment.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onDelete(assignment.id)}
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
                                    {assignment.class.name}
                                </Badge>
                                <Badge
                                    className={cn(
                                        "capitalize",
                                        assignment.status === "assigned" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
                                        assignment.status === "submitted" && "bg-blue-100 text-blue-800 hover:bg-blue-100",
                                        assignment.status === "graded" && "bg-green-100 text-green-800 hover:bg-green-100",
                                    )}
                                >
                                    {assignment.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <p className={cn("text-gray-600 text-sm", isExpanded ? "" : "line-clamp-2")}>{assignment.description}</p>
                            {!isExpanded && assignment.description.length > 150 && (
                                <Button
                                    variant="link"
                                    className="text-xs p-0 h-auto mt-1"
                                    onClick={() => toggleCardExpansion(assignment.id)}
                                >
                                    Show more
                                </Button>
                            )}
                            {isExpanded && (
                                <Button
                                    variant="link"
                                    className="text-xs p-0 h-auto mt-1"
                                    onClick={() => toggleCardExpansion(assignment.id)}
                                >
                                    Show less
                                </Button>
                            )}
                            <div className="flex flex-col gap-1 mt-3">
                                <div className="flex items-center text-sm">
                                    <Calendar className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                    <span
                                        className={cn(
                                            "text-gray-600",
                                            isPastDue && assignment.status !== "graded" && "text-red-600 font-medium",
                                        )}
                                    >
                                        Due: {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Users className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                    <span className="text-gray-600">
                                        Submissions: {assignment.submissionCount}/{assignment.totalStudents}
                                    </span>
                                </div>
                                {assignment.attachments > 0 && (
                                    <div className="flex items-center text-sm">
                                        <Paperclip className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                        <span className="text-gray-600">
                                            {assignment.attachments} attachment{assignment.attachments !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2 border-t">
                            <div className="text-xs text-gray-500">
                                Created: {format(new Date(assignment.createdAt), "MMM d, yyyy")}
                            </div>
                            <Button size="sm" variant="outline" onClick={() => onView(assignment.id)}>
                                View
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
