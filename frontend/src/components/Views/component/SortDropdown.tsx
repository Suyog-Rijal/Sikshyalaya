import type React from "react"
import { useState, useRef } from "react"
import type { RefObject } from "react"
import {useClickOutside} from "@/hooks/useClickOutside.ts";

export interface SortOption {
    id: string
    label: string
}

interface SortDropdownProps {
    options: SortOption[]
    selectedOption: string
    onSortChange: (optionId: string) => void
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ options, selectedOption, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    const selectedLabel = options.find((option) => option.id === selectedOption)?.label || "Sort by"

    const ref: RefObject<HTMLDivElement> = useRef(null)
    useClickOutside(ref, () => setIsOpen(false))

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
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
                >
                    <path d="M11 5h10"></path>
                    <path d="M11 9h7"></path>
                    <path d="M11 13h4"></path>
                    <path d="M3 17l3 3 3-3"></path>
                    <path d="M6 18V4"></path>
                </svg>
                <span>Sort by {selectedLabel}</span>
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
                    className="ml-1"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-1 bg-white rounded-md shadow w-full overflow-hidden">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                    option.id === selectedOption ? "bg-gray-100 text-gray-800" : "text-gray-700 hover:bg-gray-50"
                                }`}
                                onClick={() => {
                                    onSortChange(option.id)
                                    setIsOpen(false)
                                }}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

