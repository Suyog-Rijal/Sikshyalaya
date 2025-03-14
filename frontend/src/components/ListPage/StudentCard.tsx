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
import { EllipsisVertical } from "lucide-react"
import { CustomStatusBadge } from "@/components/ListPage/CustomStatusBadge.tsx"
import {useNavigate} from "react-router-dom";

interface StudentCardProps {
    id: string
    name: string
    className: string
    email: string
    rollNo: string
    gender: string
    status: "A" | "I" | "D"
    avatarUrl?: string
}

export function StudentCard({
                                id,
                                name,
                                className,
                                rollNo,
                                gender,
                                status,
                                avatarUrl,
                                email,
                            }: StudentCardProps) {

    const navigate = useNavigate();

    return (
        <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center w-full justify-between gap-2">
                    <CustomStatusBadge variant={status} className="capitalize">
                        {status === "A" ? (
                            <span>Active</span>
                        ) : status === "I" ? (
                            <span>Inactive</span>
                        ) : status === "D" ? (
                            <span>Disabled</span>
                        ) : null}
                    </CustomStatusBadge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <EllipsisVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => navigate('/test/')}>View</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Profile Section */}
            <div className="mt-6 flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl} alt={name} className={"w-full h-full object-cover object-center"} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground">{className}</p>
                </div>
            </div>

            {/* Student Information */}
            <div className="mt-6 space-y-4">
                <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Roll no</p>
                        <p className="text-sm font-medium">{rollNo}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="text-sm font-medium">{gender}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
        <span className="inline-flex bg-gray-100 items-center text-gray-500 rounded-md px-2.5 py-1 text-xs font-medium">
          Student
        </span>
                <Button onClick={() => navigate("/students/detail/" + id)} variant={"secondary"} size="sm">
                    View Details
                </Button>
            </div>
        </div>
    )
}

