"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertTriangle, Pencil, Trash, MoreVertical } from "lucide-react"
import { toast } from "sonner"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import { Checkbox } from "@/components/ui/checkbox"

interface DataTableProps {
    data: Array<{
        id: string
        name: string
        subjects: {
            id: string
            name: string
            full_marks: number
            pass_marks: number
        }[]
    }>
    setData: React.Dispatch<
        React.SetStateAction<
            {
                id: string
                name: string
                subjects: {
                    id: string
                    name: string
                    full_marks: number
                    pass_marks: number
                }[]
            }[]
        >
    >
    openEditDialog?: (id: string) => void
}

interface DataTableState {
    rowsPerPage: string
    currentPage: number
    selectedItems: string[]
    deleteDialogOpen: boolean
    itemToDelete: string | null
    bulkDeleteDialogOpen: boolean
    selectedClass: string
}

class SubjectDataTable extends React.Component<DataTableProps, DataTableState> {
    constructor(props: DataTableProps) {
        super(props)
        this.state = {
            rowsPerPage: "10",
            currentPage: 1,
            selectedItems: [],
            deleteDialogOpen: false,
            itemToDelete: null,
            bulkDeleteDialogOpen: false,
            selectedClass: "all",
        }
    }

    handleRowsPerPageChange = (value: string) => {
        this.setState({ rowsPerPage: value, currentPage: 1 })
    }

    handleClassChange = (value: string) => {
        this.setState({ selectedClass: value, currentPage: 1 })
    }

    getFilteredData = () => {
        const { selectedClass } = this.state

        // Filter by class if a specific class is selected
        if (selectedClass !== "all") {
            return this.props.data.filter((item) => item.id === selectedClass)
        }

        // Otherwise return all data
        return this.props.data
    }

    getFlattenedSubjects = () => {
        const filteredData = this.getFilteredData()
        // Flatten the subjects from all classes into a single array
        return filteredData.flatMap((classItem) =>
            classItem.subjects.map((subject) => ({
                ...subject,
                className: classItem.name,
                classId: classItem.id,
            })),
        )
    }

    getPaginatedData = () => {
        const flattenedSubjects = this.getFlattenedSubjects()
        const { currentPage, rowsPerPage } = this.state
        const startIndex = (currentPage - 1) * Number.parseInt(rowsPerPage)
        const endIndex = startIndex + Number.parseInt(rowsPerPage)
        return flattenedSubjects.slice(startIndex, endIndex)
    }

    handlePageChange = (page: number) => {
        this.setState({ currentPage: page })
    }

    handlePreviousPage = () => {
        this.setState((prevState) => ({
            currentPage: Math.max(prevState.currentPage - 1, 1),
        }))
    }

    handleNextPage = () => {
        const flattenedSubjects = this.getFlattenedSubjects()
        const totalPages = Math.ceil(flattenedSubjects.length / Number.parseInt(this.state.rowsPerPage))

        this.setState((prevState) => ({
            currentPage: Math.min(prevState.currentPage + 1, totalPages),
        }))
    }

    handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = this.getPaginatedData().map((subject) => subject.id)
            this.setState({ selectedItems: allIds })
        } else {
            this.setState({ selectedItems: [] })
        }
    }

    handleSelectItem = (id: string, checked: boolean) => {
        if (checked) {
            this.setState((prevState) => ({
                selectedItems: [...prevState.selectedItems, id],
            }))
        } else {
            this.setState((prevState) => ({
                selectedItems: prevState.selectedItems.filter((itemId) => itemId !== id),
            }))
        }
    }

    openBulkDeleteDialog = () => {
        this.setState({ bulkDeleteDialogOpen: true })
    }

    closeBulkDeleteDialog = () => {
        this.setState({ bulkDeleteDialogOpen: false })
    }

    handleDeleteSelected = () => {
        const { selectedItems } = this.state
        const deletePromises = selectedItems.map((id) => AxiosInstance.delete(`api/academic/subject/${id}/`))
        Promise.all(deletePromises)
            .then(() => {
                toast.success(`${selectedItems.length} subjects deleted successfully`)
                this.props.setData((prevState) =>
                    prevState
                        .map((item) => ({
                            ...item,
                            subjects: item.subjects.filter((subject) => !selectedItems.includes(subject.id)),
                        }))
                        .filter((item) => item.subjects.length > 0),
                )
                this.setState({ selectedItems: [], bulkDeleteDialogOpen: false })
            })
            .catch((err) => {
                console.error(err)
                toast.error("Failed to delete some or all subjects. Please try again.")
            })
    }

    openDeleteDialog = (id: string) => {
        this.setState({ deleteDialogOpen: true, itemToDelete: id })
    }

    closeDeleteDialog = () => {
        this.setState({ deleteDialogOpen: false, itemToDelete: null })
    }

    handleEdit = (id: string) => {
        if (this.props.openEditDialog) {
            this.props.openEditDialog(id)
        }
    }

    confirmDelete = () => {
        const { itemToDelete } = this.state
        if (!itemToDelete) return
        AxiosInstance.delete(`api/academic/subject/${itemToDelete}/`)
            .then(() => {
                toast.success("Subject deleted successfully")
                this.props.setData((prevState) =>
                    prevState
                        .map((item) => ({
                            ...item,
                            subjects: item.subjects.filter((subject) => subject.id !== itemToDelete),
                        }))
                        .filter((item) => item.subjects.length > 0),
                )
                this.closeDeleteDialog()
            })
            .catch((err) => {
                console.error(err.response)
                toast.error("Something went wrong, please try again.")
            })
    }

    render() {
        const paginatedData = this.getPaginatedData()
        const flattenedSubjects = this.getFlattenedSubjects()
        const totalPages = Math.ceil(flattenedSubjects.length / Number.parseInt(this.state.rowsPerPage))
        const { selectedItems, deleteDialogOpen, bulkDeleteDialogOpen } = this.state

        const allSelected = paginatedData.length > 0 && paginatedData.every((subject) => selectedItems.includes(subject.id))
        const someSelected = selectedItems.length > 0
        const itemToDeleteName = flattenedSubjects.find((subject) => subject.id === this.state.itemToDelete)?.name

        return (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Rows Per Page</span>
                        <Select value={this.state.rowsPerPage} onValueChange={this.handleRowsPerPageChange}>
                            <SelectTrigger className="w-[80px] h-9">
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Filter by Class</span>
                        <Select value={this.state.selectedClass} onValueChange={this.handleClassChange}>
                            <SelectTrigger className="w-[180px] h-9">
                                <SelectValue placeholder="All Classes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {this.props.data.map((classItem) => (
                                    <SelectItem key={classItem.id} value={classItem.id}>
                                        {classItem.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {someSelected && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={this.openBulkDeleteDialog}
                                className="flex items-center gap-1 ml-2"
                            >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete ({selectedItems.length})
                            </Button>
                        )}
                    </div>
                </div>

                <div className="rounded shadow-md bg-white overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[50px] text-center">
                                    <Checkbox checked={allSelected} onCheckedChange={this.handleSelectAll} aria-label="Select all" />
                                </TableHead>
                                <TableHead className="font-semibold">ID</TableHead>
                                <TableHead className="font-semibold">Subject Name</TableHead>
                                <TableHead className="font-semibold">Class Name</TableHead>
                                <TableHead className="font-semibold">Full Mark</TableHead>
                                <TableHead className="font-semibold">Pass Mark</TableHead>
                                <TableHead className="w-[70px] text-center font-semibold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((subject) => (
                                    <TableRow
                                        key={subject.id}
                                        className={selectedItems.includes(subject.id) ? "bg-muted/30" : "hover:bg-gray-50"}
                                    >
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={selectedItems.includes(subject.id)}
                                                onCheckedChange={(checked) => this.handleSelectItem(subject.id, checked as boolean)}
                                                aria-label={`Select ${subject.name}`}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-primary">{subject.id}</TableCell>
                                        <TableCell className="font-medium">{subject.name}</TableCell>
                                        <TableCell className="">{subject.className}</TableCell>
                                        <TableCell className="">{subject.full_marks}</TableCell>
                                        <TableCell className="">{subject.pass_marks}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuItem onClick={() => this.handleEdit(subject.id)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => this.openDeleteDialog(subject.id)}
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No subject data found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {flattenedSubjects.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                        <div className="text-sm text-muted-foreground">
                            Showing {(this.state.currentPage - 1) * Number.parseInt(this.state.rowsPerPage) + 1} to{" "}
                            {Math.min(this.state.currentPage * Number.parseInt(this.state.rowsPerPage), flattenedSubjects.length)} of{" "}
                            {flattenedSubjects.length} entries
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={this.handlePreviousPage}
                                disabled={this.state.currentPage === 1}
                            >
                                Previous
                            </Button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === this.state.currentPage ? "default" : "outline"}
                                        size="sm"
                                        className="w-9"
                                        onClick={() => this.handlePageChange(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={this.handleNextPage}
                                disabled={this.state.currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                <Dialog open={deleteDialogOpen} onOpenChange={this.closeDeleteDialog}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                Confirm Deletion
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                Are you sure you want to delete <span className="font-medium">{itemToDeleteName}</span>? This action
                                cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="secondary" onClick={this.closeDeleteDialog}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={this.confirmDelete}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog open={bulkDeleteDialogOpen} onOpenChange={this.closeBulkDeleteDialog}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                Confirm Bulk Deletion
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                Are you sure you want to delete {selectedItems.length} selected subjects? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="secondary" onClick={this.closeBulkDeleteDialog}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={this.handleDeleteSelected}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default SubjectDataTable
