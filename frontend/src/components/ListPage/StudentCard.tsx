"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, Loader2, Trash } from "lucide-react"
import { CustomStatusBadge } from "@/components/ListPage/CustomStatusBadge.tsx"
import { useNavigate } from "react-router-dom"

interface StudentCardProps {
    id: string
    name: string
    email: string
    rollNo: string
    gender: string
    status: "A" | "I" | "D"
    avatarUrl?: string
    schoolClass?: string
    section?: string
    onDelete?: (id: string) => void
}

export function StudentCard({
                                id,
                                name,
                                rollNo,
                                gender,
                                status,
                                avatarUrl,
                                email,
                                schoolClass,
                                section,
                                onDelete,
                            }: StudentCardProps) {
    const navigate = useNavigate()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if(onDelete) {
            onDelete(id)
        }
    }

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
                                <DropdownMenuItem onClick={() => navigate("/test/")}>View</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Profile Section */}
            <div className="mt-6 flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage
                        src={avatarUrl || "/placeholder.svg"}
                        alt={name}
                        className={"w-full h-full object-cover object-center"}
                    />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground">
                        {schoolClass} ({section})
                    </p>
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

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open)
                    // Ensure we reset the deleting state when dialog closes
                    if (!open) {
                        setIsDeleting(false)
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Student</DialogTitle>
                        <DialogDescription>
                            Are you absolutely sure you want to delete <strong>{name}</strong>? <br />
                            <span className="text-red-600 font-medium">
                This action is irreversible and will permanently remove all related data.
              </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
