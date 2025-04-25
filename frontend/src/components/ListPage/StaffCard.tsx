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
import { EllipsisVertical, Loader2 } from "lucide-react"
import { CustomStatusBadge } from "@/components/ListPage/CustomStatusBadge.tsx"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

interface StaffCardProps {
    id: string
    name: string
    email: string
    phone: string
    positionDetail?: Record<string, string>
    status: "A" | "I" | "D"
    avatarUrl?: string
    staffType?: "T" | "M"
    onDelete?: (id: string) => void
}

export function StaffCard({
                              id,
                              staffType,
                              name,
                              email,
                              phone,
                              positionDetail,
                              status,
                              avatarUrl,
                              onDelete,
                          }: StaffCardProps) {
    const navigate = useNavigate()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            toast.success(`${name} has been successfully deleted.`)

            if (onDelete) {
                onDelete(id)
            }
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("Failed to delete staff member. Please try again.")
        } finally {
            setDeleteDialogOpen(false)
            setTimeout(() => {
                setIsDeleting(false)
            }, 100)
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
                                <DropdownMenuItem onClick={() => navigate("/staff/detail/" + id)}>View</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>Delete</DropdownMenuItem>
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
                    {staffType === "T" ? (
                        <p className="text-sm text-muted-foreground">
                            {positionDetail?.school_class} ({positionDetail?.subject})
                        </p>
                    ) : staffType === "M" ? (
                        <p className="text-sm text-muted-foreground">{positionDetail?.department}</p>
                    ) : null}
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
                {staffType === "T" ? (
                    <span className="inline-flex bg-gray-100 items-center text-gray-500 rounded-md px-2.5 py-1 text-xs font-medium">
            Teacher
          </span>
                ) : staffType === "M" ? (
                    <span className="inline-flex bg-gray-100 items-center text-gray-500 rounded-md px-2.5 py-1 text-xs font-medium">
            Management
          </span>
                ) : null}
                <Button onClick={() => navigate("/staff/detail/" + id)} variant={"secondary"} size="sm">
                    View Details
                </Button>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open)
                    if (!open) {
                        setIsDeleting(false)
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Staff Member</DialogTitle>
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
