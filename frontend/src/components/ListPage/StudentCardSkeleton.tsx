"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

export function StudentCardSkeleton({ className }: { className?: string }) {
    const shimmerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Add the shimmer animation styles directly to the document
        const style = document.createElement("style")
        style.textContent = `
      @keyframes shimmerAnimation {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      
      .shimmer-effect {
        position: relative;
        overflow: hidden;
      }
      
      .shimmer-effect::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.3) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: shimmerAnimation 1.5s infinite;
      }
    `
        document.head.appendChild(style)

        return () => {
            document.head.removeChild(style)
        }
    }, [])

    return (
        <div className={cn("w-full max-w-sm rounded-lg bg-white p-4 shadow", className)} ref={shimmerRef}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center w-full justify-between gap-2">
                    <div className="h-6 w-20 rounded-full bg-gray-200 shimmer-effect" />
                    <div className="h-8 w-8 rounded-full bg-gray-200 shimmer-effect" />
                </div>
            </div>

            {/* Profile Section */}
            <div className="mt-6 flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 shimmer-effect" />
                <div className="space-y-2">
                    <div className="h-5 w-32 rounded bg-gray-200 shimmer-effect" />
                    <div className="h-4 w-40 rounded bg-gray-200 shimmer-effect" />
                </div>
            </div>

            {/* Student Information */}
            <div className="mt-6 space-y-4">
                <div className="space-y-2">
                    <div className="h-4 w-10 rounded bg-gray-200 shimmer-effect" />
                    <div className="h-4 w-40 rounded bg-gray-200 shimmer-effect" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="h-4 w-16 rounded bg-gray-200 shimmer-effect" />
                        <div className="h-4 w-20 rounded bg-gray-200 shimmer-effect" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-14 rounded bg-gray-200 shimmer-effect" />
                        <div className="h-4 w-16 rounded bg-gray-200 shimmer-effect" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
                <div className="h-6 w-20 rounded-md bg-gray-200 shimmer-effect" />
                <div className="h-8 w-24 rounded bg-gray-200 shimmer-effect" />
            </div>
        </div>
    )
}

