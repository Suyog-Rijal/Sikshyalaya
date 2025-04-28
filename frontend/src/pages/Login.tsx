"use client"
import { useEffect, useState, useRef } from "react"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { BookOpen, Eye, EyeOff, GraduationCap, Lock, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useAuthStore } from "@/store/AuthStore"
import { motion, useAnimation, useInView, type Variants } from "framer-motion"

const schema = z.object({
    role: z.enum(["admin", "staff", "student", "parent"] as const),
    email: z.string().email(),
    password: z.string().min(1),
})
type FormValues = z.infer<typeof schema>

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
}

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
        },
    },
}

export default function LoginForm() {
    const [show, setShow] = useState(false)
    const { login, isLoading, isAuthenticated, checkAuth } = useAuthStore()
    const leftSideRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(leftSideRef, { once: false })
    const controls = useAnimation()

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { role: "student", email: "", password: "" },
    })

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    useEffect(() => {
        if (isAuthenticated) window.location.href = "/dashboard"
    }, [isAuthenticated])

    useEffect(() => {
        if (isInView) {
            controls.start("visible")
        }
    }, [controls, isInView])

    async function onSubmit(v: FormValues) {
        try {
            await login(v.email, v.password, v.role)
            toast.success(`Logged in as ${v.role}`)
        } catch {
            toast.error("Invalid username or password")
            form.setValue("password", "")
        }
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Left side - Professional vector art section */}
            <motion.div
                ref={leftSideRef}
                className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-12 md:w-1/2 md:px-12"
                initial="hidden"
                animate={controls}
                variants={containerVariants}
            >


                {/* Main vector illustration */}
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <motion.svg
                        width="80%"
                        height="80%"
                        viewBox="0 0 800 600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        {/* Building/School */}


                        {/* Roof */}
                        <motion.path
                            d="M250,250 L400,150 L550,250"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/40"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                        />


                        <motion.rect
                            x="430"
                            y="280"
                            width="40"
                            height="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/40"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 1.2, ease: "easeInOut" }}
                        />



                        {/* Steps */}
                        <motion.path
                            d="M350,400 L450,400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/40"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 2.1, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M340,410 L460,410"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/40"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 2.2, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M330,420 L470,420"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/40"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 2.3, ease: "easeInOut" }}
                        />

                        {/* Books */}
                        <motion.rect
                            x="200"
                            y="350"
                            width="60"
                            height="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/40"
                            initial={{ pathLength: 0, x: 200, y: 350 }}
                            animate={{ pathLength: 1, x: 200, y: 350 }}
                            transition={{
                                pathLength: { duration: 0.5, delay: 2.4, ease: "easeInOut" },
                                x: { duration: 0.5, delay: 2.4, ease: "easeInOut" },
                                y: { duration: 0.5, delay: 2.4, ease: "easeInOut" },
                            }}
                        />
                        <motion.rect
                            x="210"
                            y="340"
                            width="60"
                            height="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/40"
                            initial={{ pathLength: 0, x: 210, y: 340 }}
                            animate={{ pathLength: 1, x: 210, y: 340 }}
                            transition={{
                                pathLength: { duration: 0.5, delay: 2.5, ease: "easeInOut" },
                                x: { duration: 0.5, delay: 2.5, ease: "easeInOut" },
                                y: { duration: 0.5, delay: 2.5, ease: "easeInOut" },
                            }}
                        />
                        <motion.rect
                            x="220"
                            y="330"
                            width="60"
                            height="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/40"
                            initial={{ pathLength: 0, x: 220, y: 330 }}
                            animate={{ pathLength: 1, x: 220, y: 330 }}
                            transition={{
                                pathLength: { duration: 0.5, delay: 2.6, ease: "easeInOut" },
                                x: { duration: 0.5, delay: 2.6, ease: "easeInOut" },
                                y: { duration: 0.5, delay: 2.6, ease: "easeInOut" },
                            }}
                        />

                        {/* Graduation Cap */}
                        <motion.path
                            d="M550,350 L600,350 L575,330 L550,350 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/40"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 2.7, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M575,330 L575,360"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/40"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 2.8, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M590,350 C590,360 560,360 560,350"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary/40"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 2.9, ease: "easeInOut" }}
                        />
                    </motion.svg>
                </div>

                {/* Content */}
                <motion.div className="z-10 flex flex-col items-center text-center" variants={containerVariants}>
                    <motion.div
                        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm shadow-lg"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div>
                            <img src="/logo.png" alt=""/>
                        </div>
                    </motion.div>

                    <motion.h1
                        className="mb-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl"
                        variants={itemVariants}
                    >
                        <span className={'text-blue-500'}>Sikshya</span><span className={'text-green-500'}>laya</span>
                    </motion.h1>

                    <motion.p className="mb-8 text-xl text-muted-foreground" variants={itemVariants}>
                        School Management System
                    </motion.p>

                    <motion.div
                        className="max-w-md rounded-lg bg-white/10 backdrop-blur-sm p-6 shadow-lg"
                        variants={itemVariants}
                    >
                        <motion.p className="mb-6 text-foreground" variants={itemVariants}>
                            A comprehensive solution for educational institutions to streamline administration, enhance communication,
                            and improve learning outcomes.
                        </motion.p>

                        <motion.div className="grid grid-cols-2 gap-4" variants={containerVariants}>
                            <motion.div
                                className="flex flex-col items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20"
                                variants={itemVariants}
                                whileHover={{ scale: 1.03 }}
                            >
                                <User className="mb-2 h-6 w-6 text-primary" />
                                <span className="text-sm font-medium">Administration</span>
                            </motion.div>

                            <motion.div
                                className="flex flex-col items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20"
                                variants={itemVariants}
                                whileHover={{ scale: 1.03 }}
                            >
                                <BookOpen className="mb-2 h-6 w-6 text-primary" />
                                <span className="text-sm font-medium">Curriculum</span>
                            </motion.div>

                            <motion.div
                                className="flex flex-col items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20"
                                variants={itemVariants}
                                whileHover={{ scale: 1.03 }}
                            >
                                <GraduationCap className="mb-2 h-6 w-6 text-primary" />
                                <span className="text-sm font-medium">Assessment</span>
                            </motion.div>

                            <motion.div
                                className="flex flex-col items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20"
                                variants={itemVariants}
                                whileHover={{ scale: 1.03 }}
                            >
                                <Mail className="mb-2 h-6 w-6 text-primary" />
                                <span className="text-sm font-medium">Communication</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Right side - Login form */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-12">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <div className="mb-8 text-center">
                        <motion.h2
                            className="text-2xl font-bold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Welcome Back
                        </motion.h2>
                        <motion.p
                            className="text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            Sign in to your account
                        </motion.p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12">
                                                        <SelectValue placeholder="Select your role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="admin" className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        <span>Administrator</span>
                                                    </SelectItem>
                                                    <SelectItem value="staff" className="flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4" />
                                                        <span>Staff</span>
                                                    </SelectItem>
                                                    <SelectItem value="student" className="flex items-center gap-2">
                                                        <GraduationCap className="h-4 w-4" />
                                                        <span>Student</span>
                                                    </SelectItem>
                                                    <SelectItem value="parent" className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        <span>Parent</span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                                                <FormControl>
                                                    <Input placeholder="Email address" className="h-12 pl-10" disabled={isLoading} {...field} />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                                                <FormControl>
                                                    <Input
                                                        type={show ? "text" : "password"}
                                                        placeholder="Password"
                                                        className="h-12 pl-10"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShow((s) => !s)}
                                                    disabled={isLoading}
                                                >
                                                    {show ? (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                    <span className="sr-only">{show ? "Hide" : "Show"}</span>
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div
                                className="flex items-center justify-end"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.1 }}
                            >
                                <a href="/forgot-password" className="text-sm text-primary hover:text-primary/90">
                                    Forgot password?
                                </a>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button type="submit" className="h-12 w-full text-base" disabled={isLoading}>
                                    {isLoading ? "Signing in..." : "Sign in"}
                                </Button>
                            </motion.div>
                        </form>
                    </Form>

                    <motion.div
                        className="mt-8 text-center text-sm text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                    >
                        <p>
                            By signing in, you agree to our{" "}
                            <a href="/terms" className="text-primary hover:underline">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </a>
                        </p>
                    </motion.div>

                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                    >
                        <p className="text-sm text-muted-foreground">
                            Need help?{" "}
                            <a href="/contact" className="text-primary hover:underline">
                                Contact support
                            </a>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
