"use client"

import * as React from "react"
import type * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface MultiSelectProps
    extends Omit<
        React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
        "value" | "defaultValue" | "onValueChange"
    > {
    value?: string[]
    defaultValue?: string[]
    onValueChange?: (value: string[]) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    children?: React.ReactNode
    name?: string
    error?: boolean
    required?: boolean
    onBlur?: React.FocusEventHandler<HTMLDivElement>
}

interface MultiSelectContextValue {
    selectedValues: string[]
    toggleValue: (value: string) => void
}

const MultiSelectContext = React.createContext<MultiSelectContextValue | undefined>(undefined)

function useMultiSelect() {
    const context = React.useContext(MultiSelectContext)
    if (!context) {
        throw new Error("useMultiSelect must be used within a MultiSelectProvider")
    }
    return context
}

// Helper function to merge refs
function useMergedRef<T>(...refs: (React.Ref<T> | undefined)[]) {
    return React.useCallback(
        (value: T) => {
            for (const ref of refs) {
                if (typeof ref === "function") {
                    ref(value)
                } else if (ref) {
                    ;(ref as React.MutableRefObject<T>).current = value
                }
            }
        },
        [refs],
    )
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
    (
        {
            value,
            defaultValue = [],
            onValueChange,
            placeholder,
            disabled,
            className,
            children,
            name,
            error,
            required,
            onBlur,
            ...props
        },
        forwardedRef,
    ) => {
        // Initialize state with defaultValue only if value is undefined
        const [selectedValues, setSelectedValues] = React.useState<string[]>(() =>
            value !== undefined ? value : defaultValue,
        )
        const [open, setOpen] = React.useState(false)
        const ref = React.useRef<HTMLDivElement>(null)
        const mergedRef = useMergedRef(ref, forwardedRef)
        const inputRef = React.useRef<HTMLInputElement>(null)

        // Sync with external value prop when it changes
        React.useEffect(() => {
            if (value !== undefined) {
                setSelectedValues(value)
            }
        }, [value])

        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    setOpen(false)
                }
            }

            document.addEventListener("mousedown", handleClickOutside)
            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        }, [])

        const toggleValue = React.useCallback(
            (itemValue: string) => {
                if (value === undefined) {
                    // For uncontrolled component
                    setSelectedValues((prev) => {
                        const newValues = prev.includes(itemValue) ? prev.filter((v) => v !== itemValue) : [...prev, itemValue]

                        // Call onValueChange after state update
                        onValueChange?.(newValues)
                        return newValues
                    })
                } else {
                    // For controlled component, just call onValueChange
                    const newValues = selectedValues.includes(itemValue)
                        ? selectedValues.filter((v) => v !== itemValue)
                        : [...selectedValues, itemValue]

                    onValueChange?.(newValues)
                }
            },
            [onValueChange, selectedValues, value],
        )

        const removeValue = React.useCallback(
            (itemValue: string, e?: React.MouseEvent) => {
                e?.stopPropagation()

                if (value === undefined) {
                    // For uncontrolled component
                    setSelectedValues((prev) => {
                        const newValues = prev.filter((v) => v !== itemValue)
                        // Call onValueChange after state update
                        onValueChange?.(newValues)
                        return newValues
                    })
                } else {
                    // For controlled component, just call onValueChange
                    const newValues = selectedValues.filter((v) => v !== itemValue)
                    onValueChange?.(newValues)
                }
            },
            [onValueChange, selectedValues, value],
        )

        const handleBlur = React.useCallback(
            (e: React.FocusEvent<HTMLDivElement>) => {
                onBlur?.(e)
            },
            [onBlur],
        )

        // Memoize context value to prevent unnecessary re-renders
        const contextValue = React.useMemo(
            () => ({
                selectedValues,
                toggleValue,
            }),
            [selectedValues, toggleValue],
        )

        return (
            <MultiSelectContext.Provider value={contextValue}>
                <div className={cn("relative", className)} ref={mergedRef} onBlur={handleBlur} {...props}>
                    <div
                        onClick={() => !disabled && setOpen((prev) => !prev)}
                        className={cn(
                            "border-input cursor-pointer data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex min-h-9 w-full items-center justify-between gap-2 rounded-sm border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus:border-purple-500",
                            error && "border-destructive ring-destructive/20",
                            disabled && "opacity-50 cursor-not-allowed",
                        )}
                        aria-invalid={error ? "true" : undefined}
                        aria-required={required}
                        tabIndex={0}
                    >
                        <div className="flex flex-wrap gap-1">
                            {selectedValues.length > 0 ? (
                                selectedValues.map((val) => (
                                    <div
                                        key={val}
                                        className="bg-accent text-accent-foreground flex items-center gap-1 rounded-sm px-1 py-0.5 text-xs"
                                    >
                                        <span>{val}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => removeValue(val, e)}
                                            className="hover:text-destructive focus:text-destructive focus:outline-none"
                                            disabled={disabled}
                                        >
                                            <XIcon className="size-3" />
                                            <span className="sr-only">Remove {val}</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <span className="text-muted-foreground">{placeholder || "Select items..."}</span>
                            )}
                        </div>
                        <ChevronDownIcon className="size-4 opacity-50" />
                    </div>
                    {/* Hidden input for form submission */}
                    {name && (
                        <input type="hidden" name={name} ref={inputRef} value={selectedValues.join(",")} required={required} />
                    )}
                    {open && !disabled && (
                        <div className="bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm border shadow-md">
                            <div className="p-1">{children}</div>
                        </div>
                    )}
                </div>
            </MultiSelectContext.Provider>
        )
    },
)

MultiSelect.displayName = "MultiSelect"

function MultiSelectGroup({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return <div data-slot="multi-select-group" className={cn("px-2 py-1.5", className)} {...props} />
}

function MultiSelectLabel({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return <div data-slot="multi-select-label" className={cn("px-2 py-1.5 text-sm font-medium", className)} {...props} />
}

function MultiSelectItem({
                             className,
                             children,
                             value,
                             ...props
                         }: React.ComponentPropsWithoutRef<"div"> & { value: string }) {
    const { selectedValues, toggleValue } = useMultiSelect()
    const isSelected = selectedValues.includes(value)

    return (
        <div
            data-slot="multi-select-item"
            className={cn(
                "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                isSelected && "bg-accent/50",
                className,
            )}
            onClick={() => toggleValue(value)}
            {...props}
        >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {isSelected && <CheckIcon className="size-4" />}
      </span>
            {children || value}
        </div>
    )
}

function MultiSelectSeparator({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div
            data-slot="multi-select-separator"
            className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
            {...props}
        />
    )
}

export { MultiSelect, MultiSelectGroup, MultiSelectItem, MultiSelectLabel, MultiSelectSeparator }

