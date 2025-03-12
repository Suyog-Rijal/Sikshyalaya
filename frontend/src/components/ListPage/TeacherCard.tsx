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
import {CustomStatusBadge} from "@/components/ListPage/CustomStatusBadge.tsx";

interface TeacherCardProps {
    id: string
    name: string
    className: string
    email: string
    phone: string
    subject: string
    status: "active" | "inactive" | "disabled"
    avatarUrl?: string
}

export function TeacherCard({ id, name, className, email, phone, subject, status, avatarUrl }: TeacherCardProps) {
    return (
        <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow">
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
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Profile Section */}
            <div className="mt-6 flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl} alt={name} className={'w-full h-full object-cover object-center'} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground">{className}</p>
                </div>
            </div>

            {/* Contact Information */}
            <div className="mt-6 space-y-4">
                <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{email}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{phone}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          {subject}
        </span>
                <Button variant="secondary" size="sm">
                    View Details
                </Button>
            </div>
        </div>
    )
}

