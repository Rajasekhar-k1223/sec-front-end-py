import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { finOpsService } from '@/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CostItem {
    service: string;
    amount: number;
    currency: string;
    trend: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function FinOps() {
    const [costs, setCosts] = useState<CostItem[]>([]);

    useEffect(() => {
        const mockCosts: CostItem[] = [
            { service: 'Amazon EC2', amount: 12500, currency: 'USD', trend: 'up' },
            { service: 'Amazon RDS', amount: 8400, currency: 'USD', trend: 'flat' },
            { service: 'Amazon S3', amount: 4200, currency: 'USD', trend: 'up' },
            { service: 'AWS Lambda', amount: 2100, currency: 'USD', trend: 'down' },
            { service: 'Data Transfer', amount: 1800, currency: 'USD', trend: 'up' },
        ];

        const fetchCosts = async () => {
            try {
                const response = await finOpsService.getCosts();
                if (response.data && response.data.length > 0) {
                    setCosts(response.data);
                } else {
                    setCosts(mockCosts);
                }
            } catch (error) {
                console.warn("Using mock FinOps costs:", error);
                setCosts(mockCosts);
            }
        };
        fetchCosts();
    }, []);

    const totalCost = costs.reduce((acc, item) => acc + item.amount, 0);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">FinOps Cloud Costs</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Monthly Spend</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Cost Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={costs}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="amount"
                                    nameKey="service"
                                >
                                    {costs.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {costs.map((item) => (
                                <div key={item.service} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className="font-medium">{item.service}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-mono">${item.amount}</div>
                                        {item.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                                        {item.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                                        {item.trend === 'flat' && <span className="text-muted-foreground">-</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
