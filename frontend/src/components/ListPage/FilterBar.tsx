"use client"

import type React from "react"
import { SortAsc } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface FilterBarProps {
    title: string
    onSortChange?: (sort: string) => void
    onFilterChange?: (filters: any) => void
    onSearchChange?: (search: string) => void
    onClassChange?: (classId: string) => void
    onSectionChange?: (sectionId: string) => void
    sortOptions?: { label: string; value: string }[]
    filterOptions?: { label: string; value: string }[]
    classOptions?: { label: string; value: string }[]
    sectionOptions?: { label: string; value: string }[]
    selectedClass?: string
    selectedSection?: string
}

export function FilterBar({
                              title,
                              onSortChange,
                              onFilterChange,
                              onSearchChange,
                              onClassChange,
                              onSectionChange,
                              sortOptions = [],
                              filterOptions = [],
                              classOptions = [],
                              sectionOptions = [],
                              selectedClass = "",
                              selectedSection = "",
                          }: FilterBarProps) {
    const [searchText, setSearchText] = useState("")

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

                    {/* Class Dropdown */}
                    {classOptions.length > 0 && (
                        <Select value={selectedClass} onValueChange={onClassChange}>
                            <SelectTrigger className="h-8 sm:h-9 w-[120px] sm:w-[140px] text-xs sm:text-sm">
                                <SelectValue placeholder="All Classes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {classOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* Section Dropdown */}
                    {sectionOptions.length > 0 && (
                        <Select value={selectedSection} onValueChange={onSectionChange}>
                            <SelectTrigger className="h-8 sm:h-9 w-[120px] sm:w-[140px] text-xs sm:text-sm">
                                <SelectValue placeholder="All Sections" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sections</SelectItem>
                                {sectionOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

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
