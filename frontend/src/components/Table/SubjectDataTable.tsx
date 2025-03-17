import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
        id: string;
        name: string;
        full_marks: number;
        pass_marks: number;
        school_class: {
            id: string;
            name: string;
        };
    }
    >
    setData: React.Dispatch<
        React.SetStateAction<
            {
                id: string;
                name: string;
                full_marks: number;
                pass_marks: number;
                school_class: {
                    id: string;
                    name: string;
                };
            }[]
        >
    >
    openEditDialog?: (id: string) => void
}

interface DataTableState {
    searchQuery: string
    rowsPerPage: string
    currentPage: number
    selectedItems: string[]
    deleteDialogOpen: boolean
    itemToDelete: string | null
    bulkDeleteDialogOpen: boolean
}

class SubjectDataTable extends React.Component<DataTableProps, DataTableState> {
    constructor(props: DataTableProps) {
        super(props)
        this.state = {
            searchQuery: "",
            rowsPerPage: "10",
            currentPage: 1,
            selectedItems: [],
            deleteDialogOpen: false,
            itemToDelete: null,
            bulkDeleteDialogOpen: false,
        }
    }

    handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchQuery: event.target.value })
    }

    handleRowsPerPageChange = (value: string) => {
        this.setState({ rowsPerPage: value, currentPage: 1 })
    }

    getFilteredData = () => {
        const { searchQuery } = this.state;

        return this.props.data.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.school_class.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = this.getFilteredData().map((item) => item.id)
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
                this.props.setData((prevState) => prevState.filter((item) => !selectedItems.includes(item.id)))
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
                this.props.setData((prevState) => prevState.filter((item) => item.id !== itemToDelete))
                this.closeDeleteDialog()
            })
            .catch((err) => {
                console.error(err.response)
                toast.error("Something went wrong, please try again.")
            })
    }

    render() {
        const filteredData = this.getFilteredData()
        const { selectedItems, deleteDialogOpen, bulkDeleteDialogOpen } = this.state

        const allSelected = filteredData.length > 0 && filteredData.every((item) => selectedItems.includes(item.id))
        const someSelected = selectedItems.length > 0
        const itemToDeleteName = this.props.data.find((item) => item.id === this.state.itemToDelete)?.name

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

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {someSelected && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={this.openBulkDeleteDialog}
                                className="flex items-center gap-1"
                            >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete ({selectedItems.length})
                            </Button>
                        )}
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full sm:w-[250px]"
                            value={this.state.searchQuery}
                            onChange={this.handleSearch}
                        />
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
                            {filteredData.length > 0 ? (
                                filteredData.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className={selectedItems.includes(row.id) ? "bg-muted/30" : "hover:bg-gray-50"}
                                    >
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={selectedItems.includes(row.id)}
                                                onCheckedChange={(checked) => this.handleSelectItem(row.id, checked as boolean)}
                                                aria-label={`Select ${row.name}`}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-primary">{row.id}</TableCell>
                                        <TableCell className="font-medium">{row.name}</TableCell>
                                        <TableCell className="">{row.school_class.name}</TableCell>
                                        <TableCell className="">{row.full_marks}</TableCell>
                                        <TableCell className="">{row.pass_marks}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => this.handleEdit(row.id)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => this.openDeleteDialog(row.id)}
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
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Single Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={this.closeDeleteDialog}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                Confirm Deletion
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                Are you sure you want to delete <span className="font-medium">{itemToDeleteName}</span>? This action cannot
                                be undone.
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

                {/* Bulk Delete Confirmation Dialog */}
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
