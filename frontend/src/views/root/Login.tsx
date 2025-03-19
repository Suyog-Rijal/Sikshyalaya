"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, School } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

type UserType = "admin" | "staff" | "student" | "parent" | null

export default function LoginPage() {
    const [userType, setUserType] = useState<UserType>(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Here you would handle actual authentication
        console.log(`Logging in as ${userType} with email: ${email}, remember me: ${rememberMe}`)

        setIsLoading(false)
        // Redirect to dashboard or appropriate page
        // window.location.href = '/dashboard'
    }

    const handleBack = () => {
        setUserType(null)
        setEmail("")
        setPassword("")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
            <div className="w-full max-w-md">
                <div className="mb-8 flex items-center justify-center">
                    <School className="h-10 w-10 text-primary" />
                    <h1 className="ml-2 text-2xl font-bold text-gray-900">EduPortal</h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-xl bg-white shadow-xl"
                >
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {userType === null ? (
                                <UserTypeSelection key="selection" setUserType={setUserType} />
                            ) : (
                                <LoginForm
                                    key="form"
                                    userType={userType}
                                    email={email}
                                    setEmail={setEmail}
                                    password={password}
                                    setPassword={setPassword}
                                    rememberMe={rememberMe}
                                    setRememberMe={setRememberMe}
                                    handleLogin={handleLogin}
                                    handleBack={handleBack}
                                    isLoading={isLoading}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} EduPortal. All rights reserved.
                </p>
            </div>
        </div>
    )
}

function UserTypeSelection({ setUserType }: { setUserType: (type: UserType) => void }) {
    const userTypes = [
        { id: "admin", label: "Administrator", icon: "/placeholder.svg" },
        { id: "staff", label: "Staff", icon: "/placeholder.svg" },
        { id: "student", label: "Student", icon: "/placeholder.svg" },
        { id: "parent", label: "Parent", icon: "/placeholder.svg" },
    ]

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">Select your role</h2>
            <div className="grid grid-cols-2 gap-4">
                {userTypes.map((type) => (
                    <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary hover:bg-blue-50"
                        onClick={() => setUserType(type.id as UserType)}
                    >
                        <div className="mb-2 rounded-full bg-blue-100 p-2">
                            <img
                                src={type.icon}
                                alt={type.label}
                                width={40}
                                height={40}
                                className="h-8 w-8"
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{type.label}</span>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    )
}

interface LoginFormProps {
    userType: UserType
    email: string
    setEmail: (email: string) => void
    password: string
    setPassword: (password: string) => void
    rememberMe: boolean
    setRememberMe: (remember: boolean) => void
    handleLogin: (e: React.FormEvent) => void
    handleBack: () => void
    isLoading: boolean
}

function LoginForm({
                       userType,
                       email,
                       setEmail,
                       password,
                       setPassword,
                       rememberMe,
                       setRememberMe,
                       handleLogin,
                       handleBack,
                       isLoading,
                   }: LoginFormProps) {
    const userTypeLabels = {
        admin: "Administrator",
        staff: "Staff",
        student: "Student",
        parent: "Parent",
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
        >
            <div className="mb-6 flex items-center">
                <Button variant="ghost" size="icon" className="mr-2 h-8 w-8" onClick={handleBack}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
                <h2 className="text-xl font-semibold text-gray-900">
                    {userTypeLabels[userType as keyof typeof userTypeLabels]} Login
                </h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="link" className="h-auto p-0 text-xs">
                            Forgot password?
                        </Button>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
                    <Label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Remember me
                    </Label>
                </div>

                <Button type="submit" className="mt-2 h-11 w-full" disabled={isLoading}>
                    {isLoading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                        />
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </form>
        </motion.div>
    )
}
