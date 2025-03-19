"use client"

import { Button } from "@/components/ui/button"
import { Grid, LayoutList, SortAsc } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {useState} from "react";

interface FilterBarProps {
    title: string
    onViewChange?: (view: "grid" | "list") => void
    onSortChange?: (sort: string) => void
    onFilterChange?: (filters: any) => void
    onSearchChange?: (search: string) => void
    sortOptions?: { label: string; value: string }[]
    filterOptions?: { label: string; value: string }[]
    defaultView?: "grid" | "list"
}

export function FilterBar({
                              title,
                              onViewChange,
                              onSortChange,
                              onFilterChange,
                              onSearchChange,
                              sortOptions = [],
                              filterOptions = [],
                              defaultView = "grid",
                          }: FilterBarProps) {
    const [view, setView] = useState<"grid" | "list">(defaultView)
    const [searchText, setSearchText] = useState("")

    const handleViewChange = (newView: "grid" | "list") => {
        setView(newView)
        onViewChange?.(newView)
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
        onSearchChange?.(event.target.value)
    }

    return (
        <div className="w-full py-4 rounded-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Input
                        placeholder="Search..."
                        value={searchText}
                        onChange={handleSearchChange}
                        className="h-8 sm:h-9 text-xs sm:text-sm w-[150px] sm:w-[200px]"
                    />
                    {filterOptions.length > 0 && (
                        <Select onValueChange={onFilterChange}>
                            <SelectTrigger className="h-8 sm:h-9 w-[100px] sm:w-[120px] text-xs sm:text-sm">
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
