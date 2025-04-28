"use client"

import { useState, useEffect } from "react"
import { Calendar, Search, CheckCircle2, AlertCircle, Globe, Users, Paperclip } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Using the same Announcement interface as the admin panel
interface Announcement {
    id: string
    title: string
    description: string
    createdAt: string
    publishedAt: string
    expiresAt?: string
    status: "published" | "draft" | "expired"
    isPublic: boolean
    class?: {
        id: string
        name: string
    }
    section?: {
        id: string
        name: string
    }
    createdBy: {
        id: string
        name: string
        role: string
    }
    priority: "normal" | "important" | "urgent"
    attachments?: {
        id: string
        name: string
        type: string
        url: string
    }[]
}

export function StudentAnnouncement() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        setLoading(true)
        try {
            // In a real application, you would fetch from your API
            // const response = await AxiosInstance.get('/api/student/announcements/')
            // setAnnouncements(response.data)

            // Using dummy data with the same structure as admin panel
            setTimeout(() => {
                const dummyAnnouncements: Announcement[] = [
                    {
                        id: "ann-1",
                        title: "School Annual Day Celebration",
                        description:
                            "We are excited to announce our Annual Day Celebration on December 15th. All students are required to participate in the cultural events. Parents are cordially invited to attend the function starting at 5:00 PM in the school auditorium.",
                        createdAt: "2025-05-01T10:30:00Z",
                        publishedAt: "2025-05-01T12:00:00Z",
                        status: "published",
                        isPublic: true,
                        createdBy: {
                            id: "user-1",
                            name: "Principal Johnson",
                            role: "Principal",
                        },
                        priority: "important",
                        attachments: [
                            {
                                id: "att-1",
                                name: "annual_day_schedule.pdf",
                                type: "application/pdf",
                                url: "#",
                            },
                        ],
                    },
                    {
                        id: "ann-2",
                        title: "Mathematics Olympiad Registration",
                        description:
                            "Registration for the National Mathematics Olympiad is now open. Interested students from classes 9-12 can register through their mathematics teachers. The preliminary round will be held on June 10th.",
                        createdAt: "2025-05-03T09:15:00Z",
                        publishedAt: "2025-05-03T11:00:00Z",
                        status: "published",
                        isPublic: false,
                        class: {
                            id: "class-9",
                            name: "Class 9",
                        },
                        section: {
                            id: "section-a",
                            name: "Section A",
                        },
                        createdBy: {
                            id: "user-2",
                            name: "Ms. Williams",
                            role: "Mathematics Department Head",
                        },
                        priority: "normal",
                    },
                    {
                        id: "ann-3",
                        title: "Parent-Teacher Meeting",
                        description:
                            "The Parent-Teacher Meeting for this semester will be held on May 20th from 9:00 AM to 2:00 PM. Parents are requested to book their slots in advance through the school portal.",
                        createdAt: "2025-05-05T14:20:00Z",
                        publishedAt: "2025-05-05T16:00:00Z",
                        status: "published",
                        isPublic: true,
                        createdBy: {
                            id: "user-3",
                            name: "Admin Office",
                            role: "Administration",
                        },
                        priority: "important",
                        attachments: [
                            {
                                id: "att-2",
                                name: "ptm_schedule.pdf",
                                type: "application/pdf",
                                url: "#",
                            },
                        ],
                    },
                    {
                        id: "ann-4",
                        title: "Science Project Submission Deadline",
                        description:
                            "This is a reminder that the Science Project submissions for Class 10 are due on May 25th. Please ensure that all project reports are submitted in both digital and physical formats as per the guidelines shared earlier.",
                        createdAt: "2025-05-10T11:30:00Z",
                        publishedAt: "2025-05-10T13:00:00Z",
                        status: "published",
                        isPublic: false,
                        class: {
                            id: "class-10",
                            name: "Class 10",
                        },
                        createdBy: {
                            id: "user-4",
                            name: "Dr. Roberts",
                            role: "Science Department Head",
                        },
                        priority: "urgent",
                    },
                    {
                        id: "ann-5",
                        title: "Holiday Notice: Founder's Day",
                        description:
                            "The school will remain closed on May 30th on account of Founder's Day. Special assembly and celebrations will be held on May 29th, and all students are expected to attend in formal uniform.",
                        createdAt: "2025-05-15T08:45:00Z",
                        publishedAt: "2025-05-15T10:00:00Z",
                        status: "published",
                        isPublic: true,
                        createdBy: {
                            id: "user-1",
                            name: "Principal Johnson",
                            role: "Principal",
                        },
                        priority: "normal",
                    },
                    {
                        id: "ann-7",
                        title: "Class 12 Pre-Board Examination Schedule",
                        description:
                            "The Pre-Board Examinations for Class 12 will commence from June 5th. The detailed schedule has been attached. Students are advised to prepare accordingly and ensure they have completed all their practical submissions.",
                        createdAt: "2025-05-20T09:30:00Z",
                        publishedAt: "2025-05-20T11:00:00Z",
                        status: "published",
                        isPublic: false,
                        class: {
                            id: "class-12",
                            name: "Class 12",
                        },
                        createdBy: {
                            id: "user-6",
                            name: "Mrs. Davis",
                            role: "Examination Coordinator",
                        },
                        priority: "urgent",
                        attachments: [
                            {
                                id: "att-3",
                                name: "pre_board_schedule.pdf",
                                type: "application/pdf",
                                url: "#",
                            },
                        ],
                    },
                    {
                        id: "ann-8",
                        title: "Library Book Return Notice",
                        description:
                            "All students are requested to return their library books before the end of the term. Any unreturned books will result in fines and may affect the issuance of report cards.",
                        createdAt: "2025-05-22T15:45:00Z",
                        publishedAt: "2025-05-22T16:30:00Z",
                        expiresAt: "2025-05-01T00:00:00Z",
                        status: "expired",
                        isPublic: true,
                        createdBy: {
                            id: "user-7",
                            name: "Ms. Clark",
                            role: "Librarian",
                        },
                        priority: "important",
                    },
                ]

                setAnnouncements(dummyAnnouncements)
                setLoading(false)
            }, 800)
        } catch (error) {
            console.error("Error fetching announcements:", error)
            setLoading(false)
        }
    }

    // Function to handle viewing an announcement - same as admin panel
    const handleViewAnnouncement = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement)
        setViewDialogOpen(true)
    }

    // Get priority badge - same as admin panel
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "normal":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        Normal
                    </Badge>
                )
            case "important":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                        Important
                    </Badge>
                )
            case "urgent":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                        Urgent
                    </Badge>
                )
            default:
                return null
        }
    }

    // @ts-expect-error: Unused variable
    const getStatusBadge = (status: string, isPublic: boolean) => {
        if (status === "published") {
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Published
                </Badge>
            )
        } else if (status === "draft") {
            return (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    Draft
                </Badge>
            )
        } else if (status === "expired") {
            return (
                <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    Expired
                </Badge>
            )
        }
        return null
    }

    // Get audience badge - same as admin panel
    const getAudienceBadge = (announcement: Announcement) => {
        if (announcement.isPublic) {
            return (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                    <Globe className="h-3.5 w-3.5 mr-1" />
                    Public
                </Badge>
            )
        } else if (announcement.class && announcement.section) {
            return (
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {announcement.class.name} {announcement.section.name}
                </Badge>
            )
        } else if (announcement.class) {
            return (
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {announcement.class.name}
                </Badge>
            )
        }
        return null
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Announcements</h1>
                <p className="text-muted-foreground">School notices and important information</p>
            </div>

            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="relative w-full sm:w-[300px]">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search announcements..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8"
                            />
                        </div>
                    </div>

                </div>

                {renderAnnouncementList()}
            </div>

            {/* View Announcement Dialog - same as admin panel */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[650px]">
                    {selectedAnnouncement && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedAnnouncement.title}</DialogTitle>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {getStatusBadge(selectedAnnouncement.status, selectedAnnouncement.isPublic)}
                                    {getAudienceBadge(selectedAnnouncement)}
                                    {getPriorityBadge(selectedAnnouncement.priority)}
                                </div>
                            </DialogHeader>
                            <div className="py-4">
                                <div className="prose prose-sm max-w-none">
                                    <p>{selectedAnnouncement.description}</p>
                                </div>

                                {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                                    <div className="mt-4 border-t pt-4">
                                        <h4 className="text-sm font-medium mb-2">Attachments</h4>
                                        <ul className="space-y-2">
                                            {selectedAnnouncement.attachments.map((attachment) => (
                                                <li key={attachment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex items-center text-sm">
                                                        <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
                                                        <span>{attachment.name}</span>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        Download
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Posted by</p>
                                        <p className="font-medium">{selectedAnnouncement.createdBy.name}</p>
                                        <p className="text-xs text-muted-foreground">{selectedAnnouncement.createdBy.role}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Published at</p>
                                        <p className="font-medium">{format(new Date(selectedAnnouncement.publishedAt), "PPP")}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(selectedAnnouncement.publishedAt), "p")}
                                        </p>
                                    </div>
                                    {selectedAnnouncement.expiresAt && (
                                        <div>
                                            <p className="text-muted-foreground">Expires at</p>
                                            <p className="font-medium">{format(new Date(selectedAnnouncement.expiresAt), "PPP")}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(selectedAnnouncement.expiresAt), "p")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )

    function renderAnnouncementList() {
        if (loading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden flex flex-col min-h-[320px] animate-pulse">
                            <CardHeader className="pb-2">
                                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                                <div className="flex gap-2">
                                    <div className="h-5 w-20 bg-gray-200 rounded" />
                                    <div className="h-5 w-20 bg-gray-200 rounded" />
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2 flex-grow">
                                <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                                <div className="h-4 w-5/6 bg-gray-200 rounded mb-2" />
                                <div className="h-4 w-4/6 bg-gray-200 rounded" />
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2">
                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                <div className="h-8 w-8 bg-gray-200 rounded-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )
        }

        if (announcements.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 min-h-[320px]">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
                    <p className="text-gray-500 mb-4 text-center">
                        There are no announcements matching your current filters. Try adjusting your search.
                    </p>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {announcements.map((announcement) => (
                    <Card
                        key={announcement.id}
                        className={`overflow-hidden hover:shadow-md transition-shadow flex flex-col min-h-[320px] ${
                            announcement.status === "expired" ? "bg-red-50 border-red-200" : ""
                        }`}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="font-medium text-lg line-clamp-2 hover:line-clamp-none cursor-pointer">
                                    {announcement.title}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {getStatusBadge(announcement.status, announcement.isPublic)}
                                {getAudienceBadge(announcement)}
                                {getPriorityBadge(announcement.priority)}
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                            <p className="text-gray-600 text-sm line-clamp-4">{announcement.description}</p>

                            {announcement.attachments && announcement.attachments.length > 0 && (
                                <div className="mt-3">
                                    <div className="flex items-center text-sm">
                                        <Paperclip className="h-3.5 w-3.5 mr-2 text-gray-500" />
                                        <span className="text-gray-600">
                      {announcement.attachments.length} attachment{announcement.attachments.length !== 1 ? "s" : ""}
                    </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2 border-t">
                            <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{`Published: ${format(new Date(announcement.publishedAt), "MMM d, yyyy")}`}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleViewAnnouncement(announcement)}>
                                View Details
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }
}
