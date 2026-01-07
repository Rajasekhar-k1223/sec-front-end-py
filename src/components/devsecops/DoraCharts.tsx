import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const deploymentData = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 19 },
    { name: 'Wed', count: 3 },
    { name: 'Thu', count: 5 },
    { name: 'Fri', count: 2 },
    { name: 'Sat', count: 0 },
    { name: 'Sun', count: 0 },
];

const leadTimeData = [
    { name: 'W1', hours: 24 },
    { name: 'W2', hours: 48 },
    { name: 'W3', hours: 12 },
    { name: 'W4', hours: 6 },
];

const failureData = [
    { name: 'W1', rate: 15 },
    { name: 'W2', rate: 10 },
    { name: 'W3', rate: 5 },
    { name: 'W4', rate: 2 },
];

const mttrData = [
    { name: 'W1', mins: 60 },
    { name: 'W2', mins: 45 },
    { name: 'W3', mins: 30 },
    { name: 'W4', mins: 15 },
];

export function DeploymentFrequencyChart() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">Deployment Frequency</CardTitle>
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Elite</Badge>
                </div>
                <CardDescription>On-demand (multiple deploys per day)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={deploymentData}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                cursor={{ fill: 'hsl(var(--muted))' }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function LeadTimeChart() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">Lead Time for Changes</CardTitle>
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Elite</Badge>
                </div>
                <CardDescription>Less than one hour</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={leadTimeData}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Line type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function ChangeFailureRateChart() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">Change Failure Rate</CardTitle>
                    <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">High</Badge>
                </div>
                <CardDescription>0-15% range</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={failureData}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Area type="monotone" dataKey="rate" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function MTTRChart() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">Time to Restore (MTTR)</CardTitle>
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Elite</Badge>
                </div>
                <CardDescription>Less than one hour</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mttrData}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Area type="monotone" dataKey="mins" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
