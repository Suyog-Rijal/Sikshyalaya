"use client"

import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import axiosInstance from "@/auth/AxiosInstance"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, Send, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChatUser {
    id: string
    room_id: string
    email: string
    full_name: string
    profile_picture: string | null
    roles: "Student" | "Parent" | "Staff" | "Teacher" | "Admin"
}

export interface Message {
    message_id: string
    room_id: string
    content: string
    timestamp: string
    sender: number
}

export interface CurrentUser {
    id: number
    email: string
    full_name: string
}

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
}

function ChatUserSkeleton() {
    return (
        <div className="flex items-center p-4 space-x-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[100px]" />
            </div>
        </div>
    )
}

export default function Chat() {
    // State management
    const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
    const [messages, setMessages] = useState<{ [roomId: string]: Message[] }>({})
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
    const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null)
    const [newMessage, setNewMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [isMobile, setIsMobile] = useState(false)

    // WebSocket state
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const accessToken = localStorage.getItem("accessToken")

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axiosInstance.get("/api/auth/me/")
                setCurrentUser(response.data)
            } catch (error) {
                console.error("Error fetching current user:", error)
                toast.error("Failed to fetch user information")
            }
        }
        fetchCurrentUser()
    }, [])

    // Fetch chat users and initial messages
    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get("/api/chat/get-users/")
                const chatsData = response.data

                // Transform the data to separate users and messages
                const users: ChatUser[] = chatsData.map((chat: any) => ({
                    id: chat.id,
                    room_id: chat.room_id,
                    email: chat.email,
                    full_name: chat.full_name,
                    profile_picture: chat.profile_picture,
                    roles: chat.roles,
                }))

                setChatUsers(users)

                // Initialize messages by room_id
                const initialMessages: { [roomId: string]: Message[] } = {}
                chatsData.forEach((chat: any) => {
                    if (chat.messages && chat.messages.length > 0) {
                        initialMessages[chat.room_id] = chat.messages
                            .map((msg: any) => ({
                                message_id: msg.id,
                                room_id: chat.room_id,
                                content: msg.content,
                                timestamp: msg.timestamp,
                                sender: msg.sender,
                            }))
                            .sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    } else {
                        initialMessages[chat.room_id] = []
                    }
                })

                setMessages(initialMessages)
            } catch (error) {
                console.error("Error fetching chats:", error)
                toast.error("Failed to load chats")
            } finally {
                setLoading(false)
            }
        }

        fetchChats()
    }, [])

    // WebSocket connection
    useEffect(() => {
        if (!accessToken) return

        const wsScheme = window.location.protocol === "https:" ? "wss" : "ws"
        const wsUrl = `${wsScheme}://127.0.0.1:8000/ws/chat/?token=${accessToken}`

        const newSocket = new WebSocket(wsUrl)

        newSocket.onopen = () => {
            console.log("WebSocket connected")
            setIsConnected(true)
            setSocket(newSocket)
        }

        newSocket.onmessage = (event) => {
            try {
                const receivedMessage: Message = JSON.parse(event.data)
                console.log("Received message:", receivedMessage)

                // Only update messages for the specific room_id
                setMessages((prev) => {
                    const roomMessages = prev[receivedMessage.room_id] || []

                    // Check if message already exists to avoid duplicates
                    const messageExists = roomMessages.some((msg) => msg.message_id === receivedMessage.message_id)

                    if (messageExists) {
                        return prev
                    }

                    // Add new message and sort by timestamp
                    const updatedMessages = [...roomMessages, receivedMessage].sort(
                        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
                    )

                    return {
                        ...prev,
                        [receivedMessage.room_id]: updatedMessages,
                    }
                })
            } catch (error) {
                console.error("Error parsing WebSocket message:", error)
            }
        }

        newSocket.onclose = () => {
            console.log("WebSocket disconnected")
            setIsConnected(false)
            setSocket(null)
        }

        newSocket.onerror = (error) => {
            console.error("WebSocket error:", error)
            setIsConnected(false)
        }

        return () => {
            newSocket.close()
        }
    }, [accessToken])

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, selectedChat])

    // Utility functions
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const getRoleBadgeColor = (role: ChatUser["roles"]) => {
        switch (role) {
            case "Admin":
                return "bg-red-50 border-2 border-red-200 text-red-800"
            case "Teacher":
                return "bg-blue-50 border-2 border-blue-200 text-blue-800"
            case "Staff":
                return "bg-green-50 border-2 border-green-200 text-green-800"
            case "Parent":
                return "bg-purple-50 border-2 border-purple-200 text-purple-800"
            case "Student":
                return "bg-orange-50 border-2 border-orange-200 text-orange-800"
            default:
                return "bg-gray-50 border-2 border-gray-200 text-gray-800"
        }
    }

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return "Today"
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday"
        } else {
            return date.toLocaleDateString()
        }
    }

    // Check if room has messages (for dot indicator)
    const hasMessages = (roomId: string) => {
        const roomMessages = messages[roomId] || []
        return roomMessages.length > 0
    }

    // Get messages for selected chat room only
    const getCurrentRoomMessages = () => {
        if (!selectedChat) return []
        return messages[selectedChat.room_id] || []
    }

    // Group messages by date
    const getGroupedMessages = () => {
        const roomMessages = getCurrentRoomMessages()
        return roomMessages.reduce((groups: { [key: string]: Message[] }, message) => {
            const date = formatDate(message.timestamp)
            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(message)
            return groups
        }, {})
    }

    // Send message
    const sendMessage = useCallback(() => {
        if (!newMessage.trim() || !selectedChat?.room_id || !socket || !isConnected) {
            return
        }

        const messageData = {
            room_id: selectedChat.room_id,
            content: newMessage.trim(),
        }

        try {
            socket.send(JSON.stringify(messageData))
            setNewMessage("")
        } catch (error) {
            console.error("Error sending message:", error)
            toast.error("Failed to send message")
        }
    }, [newMessage, selectedChat, socket, isConnected])

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const handleChatSelect = (chat: ChatUser) => {
        setSelectedChat(chat)
    }

    const handleBackToList = () => {
        setSelectedChat(null)
    }

    // Filter chats based on search
    const filteredChats = chatUsers.filter((chat) => {
        const searchTerm = searchQuery.toLowerCase()
        return (
            chat.full_name.toLowerCase().includes(searchTerm) ||
            chat.email.toLowerCase().includes(searchTerm) ||
            chat.roles.toLowerCase().includes(searchTerm)
        )
    })

    const groupedMessages = getGroupedMessages()

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Chat List Sidebar */}
            <div className={cn("w-80 bg-white border-r border-gray-200 flex flex-col", isMobile && selectedChat && "hidden")}>
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                        <div
                            className={cn("w-3 h-3 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")}
                            title={isConnected ? "Connected" : "Disconnected"}
                        />
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-gray-50 border-gray-200"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="space-y-1">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <ChatUserSkeleton key={index} />
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredChats.length > 0 ? (
                                <div className="space-y-1">
                                    {filteredChats.map((chat) => (
                                        <div
                                            key={chat.id}
                                            className={cn(
                                                "flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50",
                                                selectedChat?.id === chat.id && "bg-blue-50 border-blue-100",
                                            )}
                                            onClick={() => handleChatSelect(chat)}
                                        >
                                            <div className="relative">
                                                <Avatar className="h-12 w-12 mr-3">
                                                    <AvatarImage src={chat.profile_picture || "/placeholder.svg"} alt={chat.full_name} />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-medium">
                                                        {getInitials(chat.full_name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {/* Message indicator dot */}
                                                {hasMessages(chat.room_id) && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-medium text-gray-900 truncate">{chat.full_name}</h3>
                                                    <span
                                                        className={cn("px-2 py-1 text-xs font-medium rounded-full", getRoleBadgeColor(chat.roles))}
                                                    >
                            {chat.roles}
                          </span>
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{chat.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                                    <MessageCircle className="h-12 w-12 text-gray-300 mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                        {searchQuery ? "No matching conversations" : "No conversations found"}
                                    </h3>
                                    <p className="text-gray-500">
                                        {searchQuery
                                            ? "Try searching with a different name"
                                            : "Start a new conversation by contacting users"}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={cn("flex-1 flex flex-col bg-white", isMobile && !selectedChat && "hidden")}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <div className="flex items-center">
                                {isMobile && (
                                    <Button variant="ghost" size="sm" onClick={handleBackToList} className="mr-2">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                )}
                                <Avatar className="h-10 w-10 mr-3">
                                    <AvatarImage src={selectedChat.profile_picture || "/placeholder.svg"} alt={selectedChat.full_name} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-medium">
                                        {getInitials(selectedChat.full_name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-semibold text-gray-900">{selectedChat.full_name}</h2>
                                    <p className="text-sm text-gray-500">{selectedChat.roles}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {Object.keys(groupedMessages).length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                                    </div>
                                </div>
                            ) : (
                                Object.entries(groupedMessages).map(([date, dateMessages]) => (
                                    <div key={date}>
                                        {/* Date separator */}
                                        <div className="flex items-center justify-center my-4">
                                            <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{date}</div>
                                        </div>

                                        {/* Messages for this date */}
                                        {dateMessages.map((message) => {
                                            const isOwnMessage = currentUser && message.sender === currentUser.id
                                            return (
                                                <div
                                                    key={message.message_id}
                                                    className={cn("flex mb-4", isOwnMessage ? "justify-end" : "justify-start")}
                                                >
                                                    <div
                                                        className={cn(
                                                            "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                                                            isOwnMessage
                                                                ? "bg-blue-500 text-white rounded-br-sm"
                                                                : "bg-gray-100 text-gray-900 rounded-bl-sm",
                                                        )}
                                                    >
                                                        <p className="text-sm">{message.content}</p>
                                                        <p className={cn("text-xs mt-1", isOwnMessage ? "text-blue-100" : "text-gray-500")}>
                                                            {formatTime(message.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center space-x-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={!isConnected}
                                    className="flex-1"
                                />
                                <Button onClick={sendMessage} disabled={!newMessage.trim() || !isConnected} size="sm">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            {!isConnected && <p className="text-xs text-red-500 mt-1">Disconnected - trying to reconnect...</p>}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h2>
                            <p className="text-gray-500">Choose a contact from the sidebar to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
