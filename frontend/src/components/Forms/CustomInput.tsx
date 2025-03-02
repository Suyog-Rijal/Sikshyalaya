"use client"

import { useFormContext } from "react-hook-form"
import { AlertCircle } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export interface CustomInputProps {
    label?: string
    type?: string
    name: string
    placeholder?: string
    required?: boolean
    className?: string
}

export const CustomInput = ({ label, type = "text", name, placeholder, required = false, className = ""}: CustomInputProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext()

    const [showTooltip, setShowTooltip] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState<"top" | "bottom">("top")
    const inputRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const error = errors[name]
    const errorMessage = error?.message as string | undefined

    useEffect(() => {
        if (showTooltip && inputRef.current && tooltipRef.current) {
            const inputRect = inputRef.current.getBoundingClientRect()
            const tooltipRect = tooltipRef.current.getBoundingClientRect()
            const spaceAbove = inputRect.top
            const spaceBelow = window.innerHeight - inputRect.bottom

            if (spaceAbove > spaceBelow && spaceAbove >= tooltipRect.height + 8) {
                setTooltipPosition("top")
            } else if (spaceBelow >= tooltipRect.height + 8) {
                setTooltipPosition("bottom")
            } else {
                setTooltipPosition("top")
            }
        }
    }, [showTooltip])

    return (
        <div className={`flex flex-col gap-1 w-full ${className}`}>
            {label && (
                <label htmlFor={name} className="text-sm text-gray-700 font-medium mb-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div ref={inputRef} className="relative">
                <input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 text-sm text-black bg-white border ${error ? "border-red-500" : "border-gray-200"} rounded focus:outline-none ${error ? null : 'focus:border-[#5649E8]'} transition-colors`}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${name}-error` : undefined}
                    {...register(name)}
                />
                {error && (
                    <div
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <AlertCircle size={16} className="text-red-500" />
                        {showTooltip && (
                            <div
                                ref={tooltipRef}
                                id={`${name}-error`}
                                role="tooltip"
                                className={`absolute ${tooltipPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"} right-0 bg-white border border-gray-200 shadow-sm p-2 rounded text-xs text-red-600 w-max max-w-[200px] z-10`}
                            >
                                {errorMessage || "This field is invalid"}
                                <div
                                    className={`absolute ${tooltipPosition === "top" ? "bottom-0 translate-y-1/2" : "top-0 -translate-y-1/2"} right-4 transform rotate-45 w-2 h-2 bg-white border-b border-r border-gray-200`}
                                ></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

