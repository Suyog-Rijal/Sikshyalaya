"use client"

import type React from "react"

import { ChevronDown, Printer, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface PageHeaderProps {
    title: string
    breadcrumbs: BreadcrumbItem[]
    onRefresh?: () => void
    onPrint?: () => void
    onExport?: () => void
    primaryAction?: {
        label: string
        onClick: () => void
        icon?: React.ReactNode
    }
}

export function PageHeader({ title, breadcrumbs, onRefresh, onPrint, onExport, primaryAction }: PageHeaderProps) {
    return (
        <div className="w-full pb-4">
            <div className="flex flex-col space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h1>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <nav className="flex overflow-x-auto pb-1 sm:pb-0" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 whitespace-nowrap">
                            {breadcrumbs.map((item, index) => (
                                <li key={index} className="flex items-center">
                                    {index > 0 && <span className="mx-1 sm:mx-2 text-slate-400">/</span>}
                                    {item.href ? (
                                        <a href={item.href} className="hover:text-slate-700">
                                            {item.label}
                                        </a>
                                    ) : (
                                        <span className={index === breadcrumbs.length - 1 ? "text-slate-700" : ""}>{item.label}</span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <div className="flex items-center space-x-2 justify-evenly md:justify-end">
                        {onRefresh && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onRefresh}
                                className="h-8 w-8 sm:h-9 sm:w-9"
                                aria-label="Refresh"
                            >
                                <RotateCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                        )}

                        {onPrint && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onPrint}
                                className="h-8 w-8 sm:h-9 sm:w-9"
                                aria-label="Print"
                            >
                                <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                        )}

                        {onExport && (
                            <Button variant="outline" onClick={onExport} className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
                                <span className="mr-1">Export</span>
                                <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                        )}

                        {primaryAction && (
                            <Button
                                onClick={primaryAction.onClick}
                                className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700"
                            >
                                {primaryAction.icon && <span className="mr-1">{primaryAction.icon}</span>}
                                <span>{primaryAction.label}</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

