"use client";
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/AuthStore';

const schema = z.object({
    role: z.enum(['admin','staff','student','parent'] as const),
    email: z.string().email(),
    password: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
    const [show, setShow] = useState(false);
    const { login, isLoading, isAuthenticated, checkAuth } = useAuthStore();
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { role: 'student', email: '', password: '' },
    });

    useEffect(() => { checkAuth(); }, [checkAuth]);
    useEffect(() => { if (isAuthenticated) window.location.href = '/dashboard'; }, [isAuthenticated]);

    async function onSubmit(v: FormValues) {
        try {
            await login(v.email, v.password, v.role);
            toast.success(`Logged in as ${v.role}`);
        } catch {
            toast.error('Invalid username or password');
            form.setValue('password', '');
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader className="space-y-1">
                <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                <CardDescription className="text-center">Enter your credentials</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                        <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Role" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="parent">Parent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="name@example.com" className="pl-10" disabled={isLoading} {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type={show ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className="pl-10"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShow((s) => !s)}
                                                disabled={isLoading}
                                            >
                                                {show ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                                <span className="sr-only">{show ? 'Hide' : 'Show'}</span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm">
                    <a href="/forgot-password" className="text-primary hover:text-primary/90 underline-offset-4 hover:underline">
                        Forgot password?
                    </a>
                </div>
                <div className="text-center text-xs text-muted-foreground">
                    By logging in, you agree to our{' '}
                    <a href="/terms" className="underline hover:text-foreground">Terms</a> and{' '}
                    <a href="/privacy" className="underline hover:text-foreground">Privacy</a>
                </div>
            </CardFooter>
        </Card>
    );
}
