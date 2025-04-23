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
import { AlertTriangle, Clock, Pencil, Trash, MoreVertical } from "lucide-react"
import { toast } from "sonner"
import AxiosInstance from "@/auth/AxiosInstance.ts"
import { Checkbox } from "@/components/ui/checkbox"

interface RoutineDataTableProps {
    data: Array<{
        id: string
        school_class: {
            id: string
            name: string
        }
        section: {
            id: string
            name: string
        }
        subject: {
            id: string
            name: string
        }
        teacher: {
            id: string
            name: string
        }
        day: string
        start_time: string
        end_time: string
    }>
    setData: React.Dispatch<
        React.SetStateAction<
            Array<{
                id: string
                school_class: {
                    id: string
                    name: string
                }
                section: {
                    id: string
                    name: string
                }
                subject: {
                    id: string
                    name: string
                }
                teacher: {
                    id: string
                    name: string
                }
                day: string
                start_time: string
                end_time: string
            }>
        >
    >
    openEditDialog?: (id: string) => void
    loading?: boolean
}

interface RoutineDataTableState {
    rowsPerPage: string
    currentPage: number
    selectedItems: string[]
    deleteDialogOpen: boolean
    itemToDelete: string | null
    bulkDeleteDialogOpen: boolean
    classes: Array<{ id: string; name: string }>
    sections: Array<{ id: string; name: string }>
    selectedClass: string
    selectedSection: string
    selectedDay: string
}

class RoutineDataTable extends React.Component<RoutineDataTableProps, RoutineDataTableState> {
    constructor(props: RoutineDataTableProps) {
        super(props)
        this.state = {
            rowsPerPage: "10",
            currentPage: 1,
            selectedItems: [],
            deleteDialogOpen: false,
            itemToDelete: null,
            bulkDeleteDialogOpen: false,
            classes: [],
            sections: [],
            selectedClass: "",
            selectedSection: "",
            selectedDay: "all",
        }
    }

    componentDidMount() {
        this.fetchClasses()
        this.extractSections()
    }

    componentDidUpdate(prevProps: RoutineDataTableProps, prevState: RoutineDataTableState) {
        // Extract sections when data changes or when selected class changes
        if (prevProps.data !== this.props.data || prevState.selectedClass !== this.state.selectedClass) {
            this.extractSections()
        }
    }

    fetchClasses = async () => {
        try {
            const response = await AxiosInstance.get("/api/academic/class-list/")
            this.setState({ classes: response.data })
        } catch (error) {
            console.error("Error fetching classes:", error)
            toast.error("Failed to load classes")
        }
    }

    extractSections = () => {
        const { data } = this.props
        const { selectedClass } = this.state

        // Get unique sections from the data
        const uniqueSections = new Set<string>()
        const sectionsArray: Array<{ id: string; name: string }> = []

        // Filter by selected class if any
        const filteredData = selectedClass ? data.filter((item) => item.school_class.id === selectedClass) : data

        // Extract unique sections
        filteredData.forEach((item) => {
            if (!uniqueSections.has(item.section.id)) {
                uniqueSections.add(item.section.id)
                sectionsArray.push({
                    id: item.section.id,
                    name: item.section.name,
                })
            }
        })

        // Sort sections by name
        sectionsArray.sort((a, b) => a.name.localeCompare(b.name))

        this.setState({ sections: sectionsArray })

        // Reset section selection if the selected section is no longer available
        if (selectedClass && this.state.selectedSection) {
            const sectionExists = sectionsArray.some((section) => section.id === this.state.selectedSection)
            if (!sectionExists) {
                this.setState({ selectedSection: "" })
            }
        }
    }

    handleRowsPerPageChange = (value: string) => {
        this.setState({ rowsPerPage: value, currentPage: 1 })
    }

    handleClassChange = (value: string) => {
        if (value === "all") value = ""
        this.setState({
            selectedClass: value,
            selectedSection: "", // Reset section when class changes
            currentPage: 1,
        })
    }

    handleSectionChange = (value: string) => {
        if (value === "all") value = ""
        this.setState({ selectedSection: value, currentPage: 1 })
    }

    handleDayChange = (value: string) => {
        this.setState({ selectedDay: value, currentPage: 1 })
    }

    getFilteredData = () => {
        const { data } = this.props
        const { selectedClass, selectedSection, selectedDay } = this.state

        let filteredData = data

        // Filter by selected class if any
        if (selectedClass) {
            filteredData = filteredData.filter((item) => item.school_class.id === selectedClass)
        }

        // Filter by selected section if any
        if (selectedSection) {
            filteredData = filteredData.filter((item) => item.section.id === selectedSection)
        }

        // Filter by selected day if any
        if (selectedDay && selectedDay !== "all") {
            filteredData = filteredData.filter((item) => item.day.toLowerCase() === selectedDay.toLowerCase())
        }

        return filteredData
    }

    getPaginatedData = () => {
        const { rowsPerPage, currentPage } = this.state
        const filteredData = this.getFilteredData()

        const start = (currentPage - 1) * Number.parseInt(rowsPerPage)
        const end = start + Number.parseInt(rowsPerPage)

        return filteredData.slice(start, end)
    }

    getTotalPages = () => {
        const { rowsPerPage } = this.state
        const filteredData = this.getFilteredData()

        return Math.ceil(filteredData.length / Number.parseInt(rowsPerPage))
    }

    handlePageChange = (page: number) => {
        this.setState({ currentPage: page })
    }

    handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = this.getPaginatedData().map((item) => item.id)
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

        const deletePromises = selectedItems.map((id) => AxiosInstance.delete(`/api/academic/routine/${id}/`))

        Promise.all(deletePromises)
            .then(() => {
                toast.success(`${selectedItems.length} routines deleted successfully`)
                // Remove deleted items from the data
                this.props.setData((prevState) => prevState.filter((item) => !selectedItems.includes(item.id)))
                this.setState({ selectedItems: [], bulkDeleteDialogOpen: false })
            })
            .catch((err) => {
                console.error(err)
                toast.error("Failed to delete some or all routines. Please try again.")
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

        AxiosInstance.delete(`/api/academic/routine/${itemToDelete}/`)
            .then(() => {
                toast.success("Routine deleted successfully")
                this.props.setData((prevState) => prevState.filter((item) => item.id !== itemToDelete))
                this.closeDeleteDialog()
            })
            .catch((err) => {
                console.error(err.response)
                toast.error("Something went wrong, please try again.")
            })
    }

    formatTime = (timeString: string) => {
        try {
            // Assuming timeString is in format "HH:MM:SS" or "HH:MM"
            const [hours, minutes] = timeString.split(":")
            return `${hours}:${minutes}`
        } catch (err) {
            console.error(err)
            return timeString
        }
    }

    render() {
        const { loading } = this.props
        const {
            selectedItems,
            deleteDialogOpen,
            bulkDeleteDialogOpen,
            sections,
            selectedSection,
        } = this.state

        const paginatedData = this.getPaginatedData()

        const allSelected = paginatedData.length > 0 && paginatedData.every((item) => selectedItems.includes(item.id))
        const someSelected = selectedItems.length > 0

        const itemToDelete = this.props.data.find((item) => item.id === this.state.itemToDelete)

        return (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                    <div></div>
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

                        <Select value={this.state.selectedClass} onValueChange={this.handleClassChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="All Classes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {this.state.classes.map((classItem) => (
                                    <SelectItem key={classItem.id} value={classItem.id}>
                                        {classItem.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedSection} onValueChange={this.handleSectionChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="All Sections" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sections</SelectItem>
                                {sections.map((section) => (
                                    <SelectItem key={section.id} value={section.id}>
                                        {section.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={this.state.selectedDay} onValueChange={this.handleDayChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="All Days" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Days</SelectItem>
                                <SelectItem value="Monday">Monday</SelectItem>
                                <SelectItem value="Tuesday">Tuesday</SelectItem>
                                <SelectItem value="Wednesday">Wednesday</SelectItem>
                                <SelectItem value="Thursday">Thursday</SelectItem>
                                <SelectItem value="Friday">Friday</SelectItem>
                                <SelectItem value="Saturday">Saturday</SelectItem>
                                <SelectItem value="Sunday">Sunday</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded shadow-md bg-white overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[50px] text-center">
                                    <Checkbox checked={allSelected} onCheckedChange={this.handleSelectAll} aria-label="Select all" />
                                </TableHead>
                                <TableHead className="font-semibold">Class</TableHead>
                                <TableHead className="font-semibold">Section</TableHead>
                                <TableHead className="font-semibold">Subject</TableHead>
                                <TableHead className="font-semibold">Teacher</TableHead>
                                <TableHead className="font-semibold">Day</TableHead>
                                <TableHead className="font-semibold">Time</TableHead>
                                <TableHead className="w-[70px] text-center font-semibold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array(5)
                                    .fill(0)
                                    .map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell colSpan={8} className="h-12">
                                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className={selectedItems.includes(row.id) ? "bg-muted/30" : "hover:bg-gray-50"}
                                    >
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={selectedItems.includes(row.id)}
                                                onCheckedChange={(checked) => this.handleSelectItem(row.id, checked as boolean)}
                                                aria-label={`Select routine for ${row.subject.name}`}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{row.school_class.name}</TableCell>
                                        <TableCell>{row.section.name}</TableCell>
                                        <TableCell>{row.subject.name}</TableCell>
                                        <TableCell>{row.teacher.name}</TableCell>
                                        <TableCell>{row.day}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>
                          {this.formatTime(row.start_time)} - {this.formatTime(row.end_time)}
                        </span>
                                            </div>
                                        </TableCell>
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
                                    <TableCell colSpan={8} className="h-24 text-center">
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
                                Are you sure you want to delete the routine for{" "}
                                <span className="font-semibold">
                  {itemToDelete?.subject.name} ({itemToDelete?.day})
                </span>
                                ?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-destructive/10 rounded-md p-3 text-sm shadow-sm">
                            <p className="font-medium text-destructive">Warning:</p>
                            <p>This action cannot be undone. This will permanently delete the routine and all associated data.</p>
                        </div>
                        <DialogFooter className="gap-4 flex">
                            <Button variant="outline" onClick={this.closeDeleteDialog}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={this.confirmDelete}>
                                Delete
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
                                Are you sure you want to delete {selectedItems.length} selected{" "}
                                {selectedItems.length === 1 ? "routine" : "routines"}?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-destructive/10 rounded-md p-3 text-sm shadow-sm">
                            <p className="font-medium text-destructive">Warning:</p>
                            <p>
                                This action cannot be undone. This will permanently delete all selected routines and their associated
                                data.
                            </p>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={this.closeBulkDeleteDialog}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={this.handleDeleteSelected}>
                                Delete {selectedItems.length} {selectedItems.length === 1 ? "Routine" : "Routines"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default RoutineDataTable
