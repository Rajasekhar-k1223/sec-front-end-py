import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { llmOpsService } from '@/lib/api';

interface LLMUsage {
    model: string;
    tokens_day: number;
    cost_day: number;
    avg_latency: number;
    error_rate: number;
}

export default function LlmOps() {
    const [usage, setUsage] = useState<LLMUsage[]>([]);

    useEffect(() => {
        const mockUsage: LLMUsage[] = [
            { model: 'GPT-4', tokens_day: 125000, cost_day: 45.20, avg_latency: 850, error_rate: 0.01 },
            { model: 'GPT-3.5-Turbo', tokens_day: 850000, cost_day: 12.50, avg_latency: 200, error_rate: 0.005 },
            { model: 'Claude-3-Opus', tokens_day: 45000, cost_day: 28.00, avg_latency: 1200, error_rate: 0.02 },
            { model: 'Llama-3-70b', tokens_day: 320000, cost_day: 5.40, avg_latency: 150, error_rate: 0.01 },
        ];

        const fetchUsage = async () => {
            try {
                const response = await llmOpsService.getUsage();
                if (response.data && response.data.length > 0) {
                    setUsage(response.data);
                } else {
                    setUsage(mockUsage);
                }
            } catch (error) {
                console.warn("Using mock LLMOps usage:", error);
                setUsage(mockUsage);
            }
        };
        fetchUsage();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">LLMOps Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Token Usage</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={usage}>
                                <XAxis dataKey="model" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Bar dataKey="tokens_day" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Estimated Daily Cost ($)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={usage}>
                                <XAxis dataKey="model" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Bar dataKey="cost_day" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
