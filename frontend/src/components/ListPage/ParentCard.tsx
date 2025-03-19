"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EllipsisVertical } from "lucide-react"

interface ParentCardProps {
    id: string
    name: string
    email: string
    phone: string
    addedDate: string
    avatarUrl?: string
    student?: {
        id: string
        name: string
        avatarUrl?: string
        class?: string
        section?: string
    }[]
    onViewDetails?: (id: string) => void
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
}

export function ParentCard({
                               id,
                               name,
                               email,
                               phone,
                               addedDate,
                               avatarUrl,
                               student = [],
                               onViewDetails,
                               onEdit,
                               onDelete,
                           }: ParentCardProps) {
    return (
        <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow">
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-blue-600 font-medium">Parent</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <EllipsisVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => onViewDetails?.(id)}>View</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit?.(id)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete?.(id)}>Delete</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Profile Section */}
            <div className="mt-4 flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl} alt={name} className="w-full h-full object-cover object-center" />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground">Added on {addedDate}</p>
                </div>
            </div>

            {/* Parent Information */}
            <div className="mt-4 space-y-2">
                <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{email}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{phone}</p>
                </div>
            </div>

            {/* Child Section */}
            <div className={"flex justify-between mt-2 items-center"}>
                {student.length > 0 && (
                    <div className="w-full">
                        <p className="text-sm font-medium mb-2">Guardian of:</p>
                        <div className="gap-2 flex items-center justify-start">
                            <TooltipProvider>
                                {student.map((child) => (
                                    <Tooltip key={child.id}>
                                        <TooltipTrigger asChild>
                                            <div className="flex cursor-pointer items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage
                                                            src={child.avatarUrl}
                                                            alt={child.name}
                                                            className="w-full h-full object-cover object-center"
                                                        />
                                                        <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="text-sm">
                                                <p className="font-medium">{child.name}</p>
                                                {child.class && child.section && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {child.class} ({child.section})
                                                    </p>
                                                )}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </TooltipProvider>
                        </div>
                    </div>
                )}

                {/* View Details Button */}
                <div className="mt-4 flex justify-end">
                    <Button onClick={() => onViewDetails?.(id)} variant="secondary" size="sm">
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    )
}

