"use client"

import * as React from "react"
import {Bell, Clock, LineChart, Maximize2, Menu, MessageSquare, Moon, Search, X} from "lucide-react"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = React.useState(false)
    const [isFullscreen, setIsFullscreen] = React.useState(false)

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(r => console.log(r))
            setIsFullscreen(true)
            console.log(isFullscreen)
        } else {
            document.exitFullscreen().then(r => console.log(r))
            setIsFullscreen(false)
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white opacity-90">
            <div className="flex h-14 items-center px-2 sm:px-4">
                {/* Mobile Search Toggle */}
                <Button variant="ghost" size="icon" className="md:hidden mr-2"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}>
                    {isSearchOpen ? <X className="h-5 w-5"/> : <Search className="h-5 w-5"/>}
                    <span className="sr-only">Toggle search</span>
                </Button>

                {/* Search - Hidden on mobile unless toggled */}
                <div
                    className={`${isSearchOpen ? "flex" : "hidden"} md:flex items-center gap-2 flex-1 md:flex-initial absolute md:relative left-0 right-0 top-14 md:top-0 p-2 md:p-0 bg-white md:bg-transparent z-10 border-b md:border-0`}
                >
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"/>
                        <Input placeholder="Search..." className="pl-8 w-full"/>
                    </div>
                </div>

                {/* Academic Year */}
                <div className="hidden md:flex flex-1 items-center justify-center">
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Academic Year: 2024 / 2025</span>
                </div>

                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden ml-auto mr-2">
                            <Menu className="h-5 w-5"/>
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                        <div className="flex flex-col gap-4 py-4">
                            <div className="px-2 text-center">
                                <span className="text-sm font-medium">Academic Year: 2024 / 2025</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button variant="ghost" className="justify-start">
                                    <Clock className="mr-2 h-5 w-5"/>
                                    <span>Time</span>
                                </Button>
                                <Button variant="ghost" className="justify-start">
                                    <Moon className="mr-2 h-5 w-5"/>
                                    <span>Dark Mode</span>
                                </Button>
                                <Button variant="ghost" className="justify-start">
                                    <Bell className="mr-2 h-5 w-5"/>
                                    <span>Notifications</span>
                                </Button>
                                <Button variant="ghost" className="justify-start">
                                    <MessageSquare className="mr-2 h-5 w-5"/>
                                    <span>Messages</span>
                                </Button>
                                <Button variant="ghost" className="justify-start">
                                    <LineChart className="mr-2 h-5 w-5"/>
                                    <span>Analytics</span>
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Right side icons - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-1 lg:gap-3">
                    <Button variant="shadowed" size="icon">
                        <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500"/>
                        <span className="sr-only">Time</span>
                    </Button>

                    <Button variant="shadowed" size="icon">
                        <Moon className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500"/>
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    <Button variant="shadowed" size="icon" className="relative">
                        <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500"/>
                        <span className="sr-only">Notifications</span>
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500"/>
                    </Button>

                    <Button variant="shadowed" size="icon" className="relative">
                        <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500"/>
                        <span className="sr-only">Messages</span>
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-blue-500"/>
                    </Button>

                    <Button variant="shadowed" size="icon">
                        <LineChart className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500"/>
                        <span className="sr-only">Analytics</span>
                    </Button>

                    <Button variant="shadowed" size="icon" onClick={toggleFullscreen}>
                        <Maximize2 className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500"/>
                        <span className="sr-only">Toggle fullscreen</span>
                    </Button>
                </div>

                {/* User Profile - Always visible */}
                <div className={'justify-center items-center ml-2 p-2 rounded-md shadow hidden lg:flex'}>
                    <p className={'text-xs'}>Suyog Rijal</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="shadowed"
                                    className="relative ml-2 h-8 w-8 rounded-full cursor-pointer p-0 overflow-hidden">
                                <img
                                    src="https://scontent.fpkr1-1.fna.fbcdn.net/v/t39.30808-6/474068142_1602199393997697_2323060703896075487_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=y_aLfAosMA8Q7kNvgEnTF-W&_nc_oc=Adh_kCnZr5dZOTQNwVUUYOgytKhHagHG8ZKgdtWO9iGN7ALaRL-Lf4bQlkABPeNDeKk&_nc_zt=23&_nc_ht=scontent.fpkr1-1.fna&_nc_gid=AWtQJF2aWFJKY6vuDQSoznf&oh=00_AYFss97wfDk9pMbSKRYi532sulFSEYzCdoLDnmLJZNz6Aw&oe=67D715A7"
                                    alt="Avatar"
                                    className="rounded-full object-cover"
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2 -mr-2">
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

