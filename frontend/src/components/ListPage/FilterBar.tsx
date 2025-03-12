"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Filter, Grid, LayoutList, SortAsc } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface FilterBarProps {
    title: string
    onViewChange?: (view: "grid" | "list") => void
    onDateRangeChange?: (range: { from: Date; to: Date }) => void
    onSortChange?: (sort: string) => void
    onFilterChange?: (filters: any) => void
    sortOptions?: { label: string; value: string }[]
    filterOptions?: { label: string; value: string }[]
    defaultView?: "grid" | "list"
}

export function FilterBar({
                              title,
                              onViewChange,
                              onDateRangeChange,
                              onSortChange,
                              onFilterChange,
                              sortOptions = [],
                              filterOptions = [],
                              defaultView = "grid",
                          }: FilterBarProps) {
    const [view, setView] = useState<"grid" | "list">(defaultView)
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 7)),
    })

    const handleViewChange = (newView: "grid" | "list") => {
        setView(newView)
        onViewChange?.(newView)
    }

    const handleDateRangeChange = (range: { from: Date; to: Date }) => {
        setDateRange(range)
        onDateRangeChange?.(range)
    }

    return (
        <div className="w-full py-4 rounded-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-lg font-semibold">{title}</h2>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Date Range Selector */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm justify-start text-left font-normal"
                            >
                                <Calendar className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "MM/dd/yyyy")} - {format(dateRange.to, "MM/dd/yyyy")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "MM/dd/yyyy")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <CalendarComponent
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={(range: any) => handleDateRangeChange(range)}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    {/* Filter Button */}
                    {filterOptions.length > 0 && (
                        <Select onValueChange={onFilterChange}>
                            <SelectTrigger className="h-8 sm:h-9 w-[100px] sm:w-[120px] text-xs sm:text-sm">
                                <Filter className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                {filterOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* View Toggle */}
                    <div className="flex items-center rounded-md border">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 sm:h-9 w-8 sm:w-9 rounded-none rounded-l-md", view === "list" && "bg-muted")}
                            onClick={() => handleViewChange("list")}
                        >
                            <LayoutList className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="sr-only">List view</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 sm:h-9 w-8 sm:w-9 rounded-none rounded-r-md", view === "grid" && "bg-muted")}
                            onClick={() => handleViewChange("grid")}
                        >
                            <Grid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="sr-only">Grid view</span>
                        </Button>
                    </div>

                    {/* Sort Dropdown */}
                    {sortOptions.length > 0 && (
                        <Select onValueChange={onSortChange}>
                            <SelectTrigger className="h-8 sm:h-9 w-[120px] sm:w-[140px] text-xs sm:text-sm">
                                <SortAsc className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <SelectValue placeholder="Sort by A-Z" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>
        </div>
    )
}

