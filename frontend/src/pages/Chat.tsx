"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import {
    Search,
    Send,
    MoreHorizontal,
    Paperclip,
    Check,
    CheckCheck,
    Clock,
    X,
    FileText,
    ImageIcon,
    Download,
    User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types
interface ChatUser {
    id: string
    name: string
    avatar?: string
    role: string
    unreadCount?: number
}

interface Message {
    id: string
    senderId: string
    receiverId: string
    content: string
    timestamp: string
    status: "sending" | "sent" | "delivered" | "read" | "failed"
    type: "text" | "image" | "file"
    fileUrl?: string
    fileName?: string
    fileSize?: string
}

interface Conversation {
    id: string
    participants: ChatUser[]
    lastMessage?: Message
}

// Dummy data
const currentUser: ChatUser = {
    id: "user-1",
    name: "John Doe",
    avatar: "/green-tractor-field.png",
    role: "Teacher",
}

const dummyUsers: ChatUser[] = [
    {
        id: "user-2",
        name: "Jane Smith",
        avatar: "/javascript-code-abstract.png",
        role: "Admin",
        unreadCount: 3,
    },
    {
        id: "user-3",
        name: "Michael Johnson",
        avatar: "/musical-notes-flowing.png",
        role: "Teacher",
    },
    {
        id: "user-4",
        name: "Sarah Williams",
        avatar: "/abstract-southwest.png",
        role: "Student",
        unreadCount: 1,
    },
    {
        id: "user-5",
        name: "David Brown",
        avatar: "/database-structure.png",
        role: "Teacher",
    },
    {
        id: "user-6",
        name: "Emily Davis",
        avatar: "/abstract-geometric-ed.png",
        role: "Student",
    },
]

// Generate dummy conversations
const dummyConversations: Conversation[] = dummyUsers.map((user) => ({
    id: `conv-${user.id}`,
    participants: [user, currentUser],
    lastMessage: {
        id: `msg-${user.id}-last`,
        senderId: user.id === "user-2" || user.id === "user-4" ? user.id : "user-1",
        receiverId: user.id === "user-2" || user.id === "user-4" ? "user-1" : user.id,
        content:
            user.id === "user-2"
                ? "Can you review the curriculum changes?"
                : user.id === "user-3"
                    ? "I'll send the report by tomorrow."
                    : user.id === "user-4"
                        ? "When is the assignment due?"
                        : user.id === "user-5"
                            ? "Thanks for your help with the project."
                            : "Let me know if you need anything else.",
        timestamp:
            user.id === "user-2"
                ? "2025-05-10T16:45:00Z"
                : user.id === "user-3"
                    ? "2025-05-10T12:30:00Z"
                    : user.id === "user-4"
                        ? "2025-05-10T09:15:00Z"
                        : user.id === "user-5"
                            ? "2025-05-09T14:20:00Z"
                            : "2025-05-09T10:05:00Z",
        status: user.id === "user-2" || user.id === "user-4" ? "delivered" : "read",
        type: "text",
    },
}))

// Generate dummy messages for the first conversation
const dummyMessages: Record<string, Message[]> = {
    "conv-user-2": [
        {
            id: "msg-1",
            senderId: "user-1",
            receiverId: "user-2",
            content: "Hi Jane, how are you doing today?",
            timestamp: "2025-05-10T14:30:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-2",
            senderId: "user-2",
            receiverId: "user-1",
            content: "I'm doing well, thanks for asking! How about you?",
            timestamp: "2025-05-10T14:32:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-3",
            senderId: "user-1",
            receiverId: "user-2",
            content: "I'm good too. I wanted to discuss the new curriculum changes.",
            timestamp: "2025-05-10T14:35:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-4",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Sure, I've been reviewing them. What specific aspects would you like to discuss?",
            timestamp: "2025-05-10T14:40:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-5",
            senderId: "user-1",
            receiverId: "user-2",
            content: "I'm particularly interested in the changes to the science curriculum.",
            timestamp: "2025-05-10T14:45:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-6",
            senderId: "user-2",
            receiverId: "user-1",
            content: "I've attached the detailed document with all the proposed changes.",
            timestamp: "2025-05-10T14:50:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-7",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Curriculum_Changes_2025.pdf",
            timestamp: "2025-05-10T14:51:00Z",
            status: "read",
            type: "file",
            fileUrl: "#",
            fileName: "Curriculum_Changes_2025.pdf",
            fileSize: "2.4 MB",
        },
        {
            id: "msg-8",
            senderId: "user-1",
            receiverId: "user-2",
            content: "Thanks for sharing! I'll review it and get back to you with my thoughts.",
            timestamp: "2025-05-10T15:00:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-9",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Great! Also, here's a visual representation of the key changes.",
            timestamp: "2025-05-10T15:05:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-10",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Curriculum_Infographic.jpg",
            timestamp: "2025-05-10T15:06:00Z",
            status: "read",
            type: "image",
            fileUrl: "/comprehensive-curriculum-overview.png",
            fileName: "Curriculum_Infographic.jpg",
            fileSize: "1.2 MB",
        },
        {
            id: "msg-11",
            senderId: "user-1",
            receiverId: "user-2",
            content: "This is very helpful. When do we need to implement these changes?",
            timestamp: "2025-05-10T15:10:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-12",
            senderId: "user-2",
            receiverId: "user-1",
            content: "The implementation is scheduled for the next academic year, but we should start preparing now.",
            timestamp: "2025-05-10T15:15:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-13",
            senderId: "user-1",
            receiverId: "user-2",
            content: "Understood. Let's schedule a meeting with the department heads to discuss this further.",
            timestamp: "2025-05-10T15:20:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-14",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Good idea. How about next Tuesday at 2 PM?",
            timestamp: "2025-05-10T15:25:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-15",
            senderId: "user-1",
            receiverId: "user-2",
            content: "That works for me. I'll send out the meeting invites.",
            timestamp: "2025-05-10T15:30:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-16",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Perfect! Looking forward to it.",
            timestamp: "2025-05-10T15:35:00Z",
            status: "read",
            type: "text",
        },
        {
            id: "msg-17",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Can you review the curriculum changes?",
            timestamp: "2025-05-10T16:45:00Z",
            status: "delivered",
            type: "text",
        },
    ],
}

// Generate empty message arrays for other conversations
dummyConversations.forEach((conv) => {
    if (!dummyMessages[conv.id]) {
        dummyMessages[conv.id] = []
    }
})

export default function Chat() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(dummyConversations[0])
    const [messages, setMessages] = useState<Message[]>(dummyMessages["conv-user-2"])
    const [newMessage, setNewMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Filter conversations based on search query
    const filteredConversations = dummyConversations.filter((conv) => {
        const searchTerm = searchQuery.toLowerCase()
        const otherParticipant = conv.participants.find((p) => p.id !== currentUser.id)

        return (
            otherParticipant?.name.toLowerCase().includes(searchTerm) ||
            otherParticipant?.role.toLowerCase().includes(searchTerm)
        )
    })

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Handle sending a new message
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return

        const newMsg: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            receiverId: selectedConversation.participants.find((p) => p.id !== currentUser.id)?.id || "",
            content: newMessage.trim(),
            timestamp: new Date().toISOString(),
            status: "sending",
            type: "text",
        }

        // Add message to the conversation
        setMessages((prev) => [...prev, newMsg])
        setNewMessage("")

        // Simulate message being sent
        setTimeout(() => {
            setMessages((prev) => prev.map((msg) => (msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg)))
        }, 1000)
    }

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0 || !selectedConversation) return

        const file = files[0]
        const isImage = file.type.startsWith("image/")

        const newMsg: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            receiverId: selectedConversation.participants.find((p) => p.id !== currentUser.id)?.id || "",
            content: file.name,
            timestamp: new Date().toISOString(),
            status: "sending",
            type: isImage ? "image" : "file",
            fileUrl: isImage ? URL.createObjectURL(file) : undefined,
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        }

        // Add message to the conversation
        setMessages((prev) => [...prev, newMsg])

        // Simulate message being sent
        setTimeout(() => {
            setMessages((prev) => prev.map((msg) => (msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg)))
        }, 1500)

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    // Format timestamp
    const formatMessageTime = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const isToday =
            date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()

        if (isToday) {
            return format(date, "h:mm a")
        } else {
            return format(date, "MMM d, h:mm a")
        }
    }

    // Get message status icon
    const getMessageStatusIcon = (status: Message["status"]) => {
        switch (status) {
            case "sending":
                return <Clock className="h-3 w-3 text-gray-400" />
            case "sent":
                return <Check className="h-3 w-3 text-gray-400" />
            case "delivered":
                return <CheckCheck className="h-3 w-3 text-gray-400" />
            case "read":
                return <CheckCheck className="h-3 w-3 text-blue-500" />
            case "failed":
                return <X className="h-3 w-3 text-red-500" />
            default:
                return null
        }
    }

    // Get other participant from conversation
    const getOtherParticipant = (conversation: Conversation): ChatUser => {
        return conversation.participants.find((p) => p.id !== currentUser.id) || currentUser
    }

    return (
        <div className="flex h-[92vh]">
            {/* Left sidebar - Contacts */}
            <div className="w-1/3 flex flex-col h-full border-r">
                {/* Current user */}
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{currentUser.name}</div>
                    </div>
                </div>

                {/* Search */}
                <div className="p-3 border-b">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                {/* Contacts list */}
                <ScrollArea className="h-full overflow-hidden">
                    <div className="p-2">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map((conversation) => {
                                const otherUser = getOtherParticipant(conversation)
                                const isSelected = selectedConversation?.id === conversation.id
                                const hasUnread = otherUser.unreadCount && otherUser.unreadCount > 0

                                return (
                                    <div
                                        key={conversation.id}
                                        className={cn(
                                            "flex items-center p-3 rounded-md cursor-pointer transition-colors",
                                            isSelected ? "bg-gray-100" : "hover:bg-gray-50",
                                        )}
                                        onClick={() => {
                                            setSelectedConversation(conversation)
                                            setMessages(dummyMessages[conversation.id] || [])
                                        }}
                                    >
                                        <Avatar className="h-10 w-10 mr-3">
                                            <AvatarImage src={otherUser.avatar || "/placeholder.svg"} alt={otherUser.name} />
                                            <AvatarFallback>
                                                {otherUser.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium truncate">{otherUser.name}</div>
                                                {conversation.lastMessage && (
                                                    <div className="text-xs text-gray-500">
                                                        {formatMessageTime(conversation.lastMessage.timestamp)}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center mt-1">
                                                <div className="text-xs text-gray-500 truncate max-w-[150px]">
                                                    {conversation.lastMessage?.type === "text"
                                                        ? conversation.lastMessage.content
                                                        : conversation.lastMessage?.type === "image"
                                                            ? "📷 Image"
                                                            : "📎 File"}
                                                </div>

                                                {hasUnread && (
                                                    <div className="ml-2 h-5 w-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                                                        {otherUser.unreadCount}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <User className="h-10 w-10 text-gray-300 mb-2" />
                                <p className="text-gray-500">No contacts found</p>
                                <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Right side - Chat area */}
            <div className="w-2/3 flex flex-col h-full">
                {selectedConversation ? (
                    <>
                        {/* Chat header */}
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage
                                        src={getOtherParticipant(selectedConversation).avatar || "/placeholder.svg"}
                                        alt={getOtherParticipant(selectedConversation).name}
                                    />
                                    <AvatarFallback>
                                        {getOtherParticipant(selectedConversation)
                                            .name.split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{getOtherParticipant(selectedConversation).name}</div>
                                    <div className="text-xs text-gray-500">{getOtherParticipant(selectedConversation).role}</div>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Messages area */}
                        <ScrollArea className="h-full overflow-hidden">
                            <div className="p-4 space-y-4">
                                {messages.map((message, index) => {
                                    const isCurrentUser = message.senderId === currentUser.id

                                    // Check if we need to show date separator
                                    const showDateSeparator =
                                        index === 0 ||
                                        new Date(message.timestamp).toDateString() !==
                                        new Date(messages[index - 1].timestamp).toDateString()

                                    return (
                                        <div key={message.id}>
                                            {showDateSeparator && (
                                                <div className="flex items-center justify-center my-4">
                                                    <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                                                        {format(new Date(message.timestamp), "MMMM d, yyyy")}
                                                    </div>
                                                </div>
                                            )}

                                            <div className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
                                                {!isCurrentUser && (
                                                    <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                                                        <AvatarImage
                                                            src={getOtherParticipant(selectedConversation).avatar || "/placeholder.svg"}
                                                            alt={getOtherParticipant(selectedConversation).name}
                                                        />
                                                        <AvatarFallback>
                                                            {getOtherParticipant(selectedConversation)
                                                                .name.split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}

                                                <div className={cn("max-w-[70%]")}>
                                                    {message.type === "text" ? (
                                                        <div
                                                            className={cn(
                                                                "px-4 py-2.5 rounded-lg text-sm",
                                                                isCurrentUser ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-800",
                                                            )}
                                                        >
                                                            {message.content}
                                                        </div>
                                                    ) : message.type === "image" ? (
                                                        <div
                                                            className={cn(
                                                                "rounded-lg overflow-hidden border",
                                                                isCurrentUser ? "bg-primary/10" : "bg-gray-100",
                                                            )}
                                                        >
                                                            <div className="p-2 flex items-center gap-2 border-b bg-white">
                                                                <ImageIcon className="h-4 w-4 text-gray-500" />
                                                                <span className="text-xs font-medium">{message.fileName}</span>
                                                            </div>
                                                            <img
                                                                src={message.fileUrl || "/placeholder.svg"}
                                                                alt={message.fileName || "Image"}
                                                                className="max-w-full"
                                                            />
                                                            <div className="p-2 flex justify-between items-center bg-white">
                                                                <span className="text-xs text-gray-500">{message.fileSize}</span>
                                                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                                    <Download className="h-3 w-3 mr-1" />
                                                                    Download
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={cn("rounded-lg border", isCurrentUser ? "bg-primary/10" : "bg-gray-100")}>
                                                            <div className="p-3 flex items-center gap-3 bg-white rounded-lg">
                                                                <div className="bg-gray-100 p-2 rounded-md">
                                                                    <FileText className="h-6 w-6 text-gray-500" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="truncate font-medium text-sm">{message.fileName}</p>
                                                                    <p className="text-xs text-gray-500">{message.fileSize}</p>
                                                                </div>
                                                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                                    <Download className="h-3 w-3 mr-1" />
                                                                    Download
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div
                                                        className={cn(
                                                            "flex items-center text-xs text-gray-400 mt-1",
                                                            isCurrentUser ? "justify-end" : "justify-start",
                                                        )}
                                                    >
                                                        <span>{formatMessageTime(message.timestamp)}</span>
                                                        {isCurrentUser && <span className="ml-1">{getMessageStatusIcon(message.status)}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Message input */}
                        <div className="p-3 border-t">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="flex-shrink-0"
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.click()
                                        }
                                    }}
                                >
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                                <div className="flex-1 relative">
                                    <Textarea
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault()
                                                handleSendMessage()
                                            }
                                        }}
                                        className="min-h-[40px] max-h-[120px] py-2 px-3 resize-none"
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                    />
                                </div>
                                <Button className="flex-shrink-0" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                        <p className="text-muted-foreground max-w-md">Choose a contact from the list to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    )
}
