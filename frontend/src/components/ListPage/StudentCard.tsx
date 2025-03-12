import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, MessageCircle, Mail } from 'lucide-react'
import { CustomStatusBadge } from "@/components/ListPage/CustomStatusBadge.tsx"

interface StudentCardProps {
    id: string
    name: string
    className: string
    rollNo: string
    gender: string
    joinedOn: string
    status: "active" | "inactive" | "disabled"
    avatarUrl?: string
    onAddFees?: () => void
}

export function StudentCard({
                                id,
                                name,
                                className,
                                rollNo,
                                gender,
                                joinedOn,
                                status,
                                avatarUrl,
                                onAddFees
                            }: StudentCardProps) {
    return (
        <div className="w-full max-w-sm rounded-lg bg-white p-4 flex flex-col gap-3 shadow">
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">{id}</span>
                <div className="flex items-center gap-2">
                    <CustomStatusBadge variant={status} className="capitalize">
                        {status}
                    </CustomStatusBadge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <EllipsisVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>View</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Profile Section */}
            <div className="mt-4 flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl} alt={name} className="w-full h-full object-cover object-center" />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground">{className}</p>
                </div>
            </div>

            {/* Student Information */}
            <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
                <div>
                    <p className="text-sm text-muted-foreground">Roll No</p>
                    <p className="text-sm font-medium">{rollNo}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="text-sm font-medium">{gender}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Joined On</p>
                    <p className="text-sm font-medium">{joinedOn}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-100">
                        <MessageCircle className="h-5 w-5 text-slate-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-100">
                        <Mail className="h-5 w-5 text-slate-600" />
                    </Button>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onAddFees}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800"
                >
                    Add Fees
                </Button>
            </div>
        </div>
    )
}
