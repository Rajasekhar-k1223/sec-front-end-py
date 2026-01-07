import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const defaultData = [
    { name: 'Pass', value: 0, color: '#22c55e' },
    { name: 'Fail', value: 0, color: '#ef4444' },
    { name: 'Warning', value: 0, color: '#eab308' },
];

interface ComplianceChartProps {
    data?: { name: string; value: number; color?: string }[];
}

export default function ComplianceChart({ data = defaultData }: ComplianceChartProps) {
    // Merge colors if missing
    const chartData = data.map(item => ({
        ...item,
        color: item.name === 'Pass' ? '#22c55e' : item.name === 'Fail' ? '#ef4444' : '#eab308'
    }));

    // Calculate Score
    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
    const pass = chartData.find(d => d.name === 'Pass')?.value || 0;
    const score = total > 0 ? Math.round((pass / total) * 100) : 0;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>CIS Benchmark Compliance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                    <span className="text-4xl font-bold text-foreground">{score}%</span>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>
            </CardContent>
        </Card>
    );
}
