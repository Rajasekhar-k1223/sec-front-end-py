import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Shield, Lock, Activity, Users } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    const handleDemoRole = (role: string) => {
        if (role === 'admin') {
            setEmail('admin@sec.com');
            setPassword('admin');
        } else if (role === 'analyst') {
            setEmail('analyst@sec.com');
            setPassword('analyst');
        } else if (role === 'viewer') {
            setEmail('viewer@sec.com');
            setPassword('viewer');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border shadow-2xl relative overflow-hidden">

                {/* Decorative Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                <div className="text-center relative z-10">
                    <div className="mx-auto h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Omni-Agent AI</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Next-Gen Security Operations</p>
                </div>

                <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
                            {error}
                        </div>
                    )}

                    {/* Demo Role Selector */}
                    <div className="space-y-2">
                        <Label>Quick Demo Login</Label>
                        <Select onValueChange={handleDemoRole}>
                            <SelectTrigger className="bg-secondary/50">
                                <SelectValue placeholder="Select a Demo Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">
                                    <div className="flex items-center">
                                        <Users className="mr-2 h-4 w-4" /> Admin (Full Access)
                                    </div>
                                </SelectItem>
                                <SelectItem value="analyst">
                                    <div className="flex items-center">
                                        <Activity className="mr-2 h-4 w-4" /> Analyst (Ops & Incidents)
                                    </div>
                                </SelectItem>
                                <SelectItem value="viewer">
                                    <div className="flex items-center">
                                        <Shield className="mr-2 h-4 w-4" /> Viewer (Read Only)
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or sign in manually</span>
                        </div>
                    </div>

                    <div className="text-center text-sm mt-4">
                        <span className="text-muted-foreground">New to Omni-Agent? </span>
                        <Link to="/register" className="text-primary hover:underline font-medium">Create Tenant</Link>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="admin@sec.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-secondary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-secondary/50"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 h-10 text-base"
                        disabled={isLoading}
                    >
                        {isLoading ? <Activity className="animate-spin mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                    </Button>

                    <div className="text-center text-xs text-muted-foreground">
                        PROTECTED SYSTEM. AUTHORIZED ACCESS ONLY.
                    </div>
                </form>
            </div>
        </div>
    );
}
