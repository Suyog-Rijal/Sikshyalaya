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
    Plus,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
    deleted?: boolean
}

interface Conversation {
    id: string
    participants: ChatUser[]
    lastMessage?: Message
}

// Dummy data
const currentUser: ChatUser = {
    id: "user-1",
    name: "Slade Juarez",
    avatar: "/green-tractor-field.png",
    role: "Teacher",
}

const dummyUsers: ChatUser[] = [
    {
        id: "user-2",
        name: "Slade Juarez",
        avatar: "/javascript-code-abstract.png",
        role: "teacher",
    },
    {
        id: "user-3",
        name: "Wyoming Golden ",
        avatar: "/musical-notes-flowing.png",
        role: "Teacher",
    },
    {
        id: "user-4",
        name: "Admin Admin",
        avatar: "/abstract-southwest.png",
        role: "admin",
        unreadCount: 1,
    },
]

// Generate initial messages for each conversation (only 2 messages per conversation)
const initialMessages: Record<string, Message[]> = {
    "conv-user-2": [
        {
            id: "msg-1",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Test, Recently you have been doing late on assignment submission. Please be careful next time!",
            timestamp: new Date().toISOString(),
            status: "read",
            type: "text",
        },
        {
            id: "msg-2",
            senderId: "user-1",
            receiverId: "user-2",
            content: "Thank you sir for reminding me. I will submit my today english assignment on time!",
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
            status: "read",
            type: "text",
        },
    ],
    "conv-user-3": [
        {
            id: "msg-1",
            senderId: "user-1",
            receiverId: "user-3",
            content: "Hi Wyoming, do you have the lesson plans ready for next week?",
            timestamp: new Date().toISOString(),
            status: "read",
            type: "text",
        },
        {
            id: "msg-2",
            senderId: "user-3",
            receiverId: "user-1",
            content: "Yes, I'll send them to you by tomorrow morning.",
            timestamp: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
            status: "read",
            type: "text",
        },
    ],
    "conv-user-4": [
        {
            id: "msg-1",
            senderId: "user-1",
            receiverId: "user-4",
            content: "Hello Admin, I need help with the new grading system.",
            timestamp: new Date().toISOString(),
            status: "read",
            type: "text",
        },
        {
            id: "msg-2",
            senderId: "user-4",
            receiverId: "user-1",
            content: "Sure, what specific issues are you having with it?",
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
            status: "delivered",
            type: "text",
        },
    ],
}

// Generate dummy conversations
const dummyConversations: Conversation[] = dummyUsers.map((user) => ({
    id: `conv-${user.id}`,
    participants: [user, currentUser],
    lastMessage: initialMessages[`conv-${user.id}`][1], // Use the last message as the conversation preview
}))

// Full message history (not shown by default)
const fullMessageHistory: Record<string, Message[]> = {
    "conv-user-2": [
        ...initialMessages["conv-user-2"],
        {
            id: "msg-3",
            senderId: "user-1",
            receiverId: "user-2",
            content: "Have you completed your registration for all classes?",
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
            status: "read",
            type: "text",
        },
        {
            id: "msg-4",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Yes, I've registered for all required courses.",
            timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString(), // 1.5 hours ago
            status: "read",
            type: "text",
        },
        {
            id: "msg-5",
            senderId: "user-1",
            receiverId: "user-2",
            content: "Great! Here's the orientation schedule.",
            timestamp: new Date(Date.now() - 1 * 3600000).toISOString(), // 1 hour ago
            status: "read",
            type: "text",
        },
        {
            id: "msg-6",
            senderId: "user-1",
            receiverId: "user-2",
            content: "Orientation_Schedule.pdf",
            timestamp: new Date(Date.now() - 55 * 60000).toISOString(), // 55 minutes ago
            status: "read",
            type: "file",
            fileUrl: "#",
            fileName: "Orientation_Schedule.pdf",
            fileSize: "1.2 MB",
        },
        {
            id: "msg-7",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Thank you! I'll review it right away.",
            timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
            status: "read",
            type: "text",
        },
    ],
    "conv-user-3": [
        ...initialMessages["conv-user-3"],
        {
            id: "msg-3",
            senderId: "user-3",
            receiverId: "user-1",
            content: "I've also prepared some new materials for the science class.",
            timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
            status: "read",
            type: "text",
        },
        {
            id: "msg-4",
            senderId: "user-1",
            receiverId: "user-3",
            content: "That's excellent! Can you share them with me?",
            timestamp: new Date(Date.now() - 2.5 * 3600000).toISOString(), // 2.5 hours ago
            status: "read",
            type: "text",
        },
        {
            id: "msg-5",
            senderId: "user-3",
            receiverId: "user-1",
            content: "Science_Materials.jpg",
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
            status: "read",
            type: "image",
            fileUrl: "/science-materials.png",
            fileName: "Science_Materials.jpg",
            fileSize: "2.3 MB",
        },
    ],
    "conv-user-4": [
        ...initialMessages["conv-user-4"],
        {
            id: "msg-3",
            senderId: "user-1",
            receiverId: "user-4",
            content: "I'm having trouble with the grade submission feature.",
            timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
            status: "read",
            type: "text",
        },
        {
            id: "msg-4",
            senderId: "user-4",
            receiverId: "user-1",
            content: "I'll need to see the error. Can you send a screenshot?",
            timestamp: new Date(Date.now() - 3.5 * 3600000).toISOString(), // 3.5 hours ago
            status: "read",
            type: "text",
        },
        {
            id: "msg-5",
            senderId: "user-1",
            receiverId: "user-4",
            content: "Error_Screenshot.png",
            timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
            status: "read",
            type: "image",
            fileUrl: "/error-screenshot.png",
            fileName: "Error_Screenshot.png",
            fileSize: "1.5 MB",
        },
        {
            id: "msg-6",
            senderId: "user-4",
            receiverId: "user-1",
            content: "Thanks, I'll look into this and get back to you soon.",
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
            status: "read",
            type: "text",
        },
    ],
}

export default function Chat() {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchMessagesQuery, setSearchMessagesQuery] = useState("")
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(dummyConversations[0])
    const [messages, setMessages] = useState<Message[]>(initialMessages["conv-user-2"])
    const [newMessage, setNewMessage] = useState("")
    const [isSearchingMessages, setIsSearchingMessages] = useState(false)
    const [showFullHistory, setShowFullHistory] = useState<Record<string, boolean>>({
        "conv-user-2": false,
        "conv-user-3": false,
        "conv-user-4": false,
    })
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

    // Handle message deletion
    const handleDeleteMessage = (messageId: string) => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === messageId ? { ...msg, deleted: true, content: "This message was deleted" } : msg)),
        )
    }

    // Toggle full message history
    const toggleFullHistory = (conversationId: string) => {
        if (showFullHistory[conversationId]) {
            // If currently showing full history, switch back to initial messages
            setMessages(initialMessages[conversationId] || [])
        } else {
            // If currently showing initial messages, switch to full history
            setMessages(fullMessageHistory[conversationId] || [])
        }

        // Update the state
        setShowFullHistory((prev) => ({
            ...prev,
            [conversationId]: !prev[conversationId],
        }))
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

    // Filter messages based on search query
    const filteredMessages = messages.filter((message) => {
        if (!searchMessagesQuery) return true

        const searchTerm = searchMessagesQuery.toLowerCase()
        if (message.type === "text") {
            return message.content.toLowerCase().includes(searchTerm)
        } else if (message.type === "file" || message.type === "image") {
            return message.fileName?.toLowerCase().includes(searchTerm) || false
        }
        return false
    })

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

    // Handle conversation selection
    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation)
        const convId = conversation.id

        // Reset to initial messages when switching conversations
        setMessages(initialMessages[convId] || [])

        // Reset the full history flag
        setShowFullHistory((prev) => ({
            ...prev,
            [convId]: false,
        }))
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
                                        onClick={() => handleSelectConversation(conversation)}
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
                                    <DropdownMenuItem onClick={() => setIsSearchingMessages(!isSearchingMessages)}>
                                        {isSearchingMessages ? "Exit Search" : "Search Messages"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleFullHistory(selectedConversation.id)}>
                                        {showFullHistory[selectedConversation.id] ? "Show Less Messages" : "Show More Messages"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Clear Chat History</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Message search bar - only shown when searching */}
                        {isSearchingMessages && (
                            <div className="p-3 border-b">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search in conversation..."
                                        value={searchMessagesQuery}
                                        onChange={(e) => setSearchMessagesQuery(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Messages area */}
                        <ScrollArea className="h-full overflow-hidden">
                            <div className="p-4 space-y-4">
                                {/* Show more messages button (only if not showing full history) */}
                                {!showFullHistory[selectedConversation.id] &&
                                    fullMessageHistory[selectedConversation.id]?.length > 2 && (
                                        <div className="flex justify-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                onClick={() => toggleFullHistory(selectedConversation.id)}
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                Show Previous Messages
                                            </Button>
                                        </div>
                                    )}

                                {filteredMessages.map((message, index) => {
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

                                                <div className={cn("max-w-[70%] group")}>
                                                    {message.deleted ? (
                                                        <div
                                                            className={cn(
                                                                "px-4 py-2.5 rounded-lg text-sm italic",
                                                                isCurrentUser
                                                                    ? "bg-primary/30 text-primary-foreground/70"
                                                                    : "bg-gray-100 text-gray-500",
                                                            )}
                                                        >
                                                            {message.content}
                                                        </div>
                                                    ) : message.type === "text" ? (
                                                        <div className="relative">
                                                            <div
                                                                className={cn(
                                                                    "px-4 py-2.5 rounded-lg text-sm",
                                                                    isCurrentUser ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-800",
                                                                )}
                                                            >
                                                                {message.content}
                                                            </div>
                                                            {isCurrentUser && (
                                                                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 bg-primary/20 hover:bg-primary/30"
                                                                            >
                                                                                <MoreHorizontal className="h-3 w-3 text-primary-foreground" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)}>
                                                                                Delete Message
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : message.type === "image" ? (
                                                        <div
                                                            className={cn(
                                                                "rounded-lg overflow-hidden border relative",
                                                                isCurrentUser ? "bg-primary/10" : "bg-gray-100",
                                                            )}
                                                        >
                                                            {isCurrentUser && (
                                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 bg-white/80 backdrop-blur-sm"
                                                                            >
                                                                                <MoreHorizontal className="h-3 w-3" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)}>
                                                                                Delete
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            )}
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
                                                        <div
                                                            className={cn(
                                                                "rounded-lg border relative",
                                                                isCurrentUser ? "bg-primary/10" : "bg-gray-100",
                                                            )}
                                                        >
                                                            {isCurrentUser && (
                                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 bg-white/80 backdrop-blur-sm"
                                                                            >
                                                                                <MoreHorizontal className="h-3 w-3" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)}>
                                                                                Delete
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            )}
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
