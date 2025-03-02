import type React from "react"
import { useState, useRef } from "react"
import type { RefObject } from "react"
import {useClickOutside} from "@/hooks/useClickOutside.ts";

export interface FilterOption {
    id: string
    label: string
    checked: boolean
}

export interface FilterGroup {
    id: string
    name: string
    options: FilterOption[]
}

interface FilterDropdownProps {
    filterGroups: FilterGroup[]
    onFilterChange: (groupId: string, optionId: string, checked: boolean) => void
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ filterGroups, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    const ref: RefObject<HTMLDivElement> = useRef(null)
    useClickOutside(ref, () => setIsOpen(false))

    const handleOptionChange = (groupId: string, optionId: string, checked: boolean) => {
        onFilterChange(groupId, optionId, checked)
    }

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full justify-between items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <div className={'flex justify-center items-center gap-2'}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    <span>Filter</span>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 z-10 mt-1 bg-white rounded-md shadow p-3 w-full">
                    {filterGroups.map((group) => (
                        <div key={group.id} className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">{group.name}</h3>
                            <div className="space-y-2">
                                {group.options.map((option) => (
                                    <label key={option.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-500 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-offset-0"
                                            checked={option.checked}
                                            onChange={(e) => handleOptionChange(group.id, option.id, e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t mt-2">
                        <button
                            type="button"
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

