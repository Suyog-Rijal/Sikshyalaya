import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Clock, Trash, Search } from "lucide-react"
import { toast } from "sonner"
import AxiosInstance from "@/auth/AxiosInstance.ts"

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
    teacherSearch: string
}

class TeacherRoutineDatatable extends React.Component<RoutineDataTableProps, RoutineDataTableState> {
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
            teacherSearch: "",
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
                    name: `${item.school_class.name} (${item.section.name})`,
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

    handleTeacherSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ teacherSearch: e.target.value, currentPage: 1 })
    }

    getFilteredData = () => {
        const { data } = this.props
        const { selectedClass, selectedSection, selectedDay, teacherSearch } = this.state

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

        // Filter by teacher name if search text is provided
        if (teacherSearch.trim()) {
            filteredData = filteredData.filter((item) =>
                item.teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()),
            )
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
            rowsPerPage,
            currentPage,
        } = this.state

        const filteredData = this.getFilteredData()
        const paginatedData = this.getPaginatedData()
        const totalPages = this.getTotalPages()

        const someSelected = selectedItems.length > 0

        const itemToDelete = this.props.data.find((item) => item.id === this.state.itemToDelete)

        return (
            <div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span>Rows Per Page</span>
                        <Select value={rowsPerPage} onValueChange={this.handleRowsPerPageChange}>
                            <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="15">15</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 max-w-sm mx-auto">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={this.state.teacherSearch}
                                onChange={this.handleTeacherSearchChange}
                                className="pl-8"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-2">
                            {someSelected && (
                                <Button variant="destructive" size="sm" onClick={this.openBulkDeleteDialog}>
                                    <Trash className="h-4 w-4 mr-1" />
                                    Delete ({selectedItems.length})
                                </Button>
                            )}
                        </div>

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

                <div className="rounded border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>

                                <TableHead>Class</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Teacher</TableHead>
                                <TableHead>Day</TableHead>
                                <TableHead>Time</TableHead>
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
                                    <TableRow key={row.id}>

                                        <TableCell>{row.school_class.name}</TableCell>
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

                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {paginatedData.length > 0 ? (currentPage - 1) * Number.parseInt(rowsPerPage) + 1 : 0}-
                        {Math.min(currentPage * Number.parseInt(rowsPerPage), filteredData.length)} of {filteredData.length} entries
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => this.handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            // Show pages around current page
                            let pageToShow = currentPage
                            if (currentPage <= 3) {
                                pageToShow = i + 1
                            } else if (currentPage >= totalPages - 2) {
                                pageToShow = totalPages - 4 + i
                            } else {
                                pageToShow = currentPage - 2 + i
                            }

                            // Ensure page is within valid range
                            if (pageToShow > 0 && pageToShow <= totalPages) {
                                return (
                                    <Button
                                        key={pageToShow}
                                        variant={currentPage === pageToShow ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => this.handlePageChange(pageToShow)}
                                    >
                                        {pageToShow}
                                    </Button>
                                )
                            }
                            return null
                        })}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => this.handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            Next
                        </Button>
                    </div>
                </div>

                {/* Single Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={this.closeDeleteDialog}>
                    <DialogContent>
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
                        <div className="bg-destructive/10 rounded-md p-3 text-sm">
                            <p className="font-medium text-destructive">Warning:</p>
                            <p>This action cannot be undone. This will permanently delete the routine and all associated data.</p>
                        </div>
                        <DialogFooter>
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
                    <DialogContent>
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
                        <div className="bg-destructive/10 rounded-md p-3 text-sm">
                            <p className="font-medium text-destructive">Warning:</p>
                            <p>
                                This action cannot be undone. This will permanently delete all selected routines and their associated
                                data.
                            </p>
                        </div>
                        <DialogFooter>
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

export default TeacherRoutineDatatable
