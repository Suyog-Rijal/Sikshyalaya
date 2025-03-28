import type { ReactNode } from "react"

type BadgeVariant = "A" | "I" | "D"

type CustomStatusBadgeProps = {
    children: ReactNode
    variant?: BadgeVariant
    className?: string
}

export function CustomStatusBadge({ children, variant = "A", className = "" }: CustomStatusBadgeProps) {
    const variantStyles = {
        A: {
            container: "bg-green-100 text-green-500",
            dot: "bg-green-500",
        },
        I: {
            container: "bg-gray-100 text-gray-500",
            dot: "bg-gray-500",
        },
        D: {
            container: "bg-red-100 text-red-500",
            dot: "bg-red-500",
        },
    }

    const selectedStyle = variantStyles[variant]

    return (
        <div
            className={`w-16 rounded-lg text-xs flex gap-1 items-center justify-center py-1 px-2 ${selectedStyle.container} ${className}`}
        >
            <div className={`w-2 h-2 rounded-full ${selectedStyle.dot}`}></div>
            {children}
        </div>
    )
}

