import { useEffect, useState } from 'react';
import { api, ENDPOINTS } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Shield,
    AlertTriangle,
    Users,
    Globe,
    Activity,
    ArrowUpRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

interface DashboardStats {
    active_agents: number;
    total_alerts: number;
    total_users: number;
    system_status: string;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Mock Data for Charts (until backend provides historical data)
    const trafficData = [
        { name: '00:00', traffic: 4000 },
        { name: '04:00', traffic: 3000 },
        { name: '08:00', traffic: 2000 },
        { name: '12:00', traffic: 2780 },
        { name: '16:00', traffic: 1890 },
        { name: '20:00', traffic: 2390 },
        { name: '23:59', traffic: 3490 },
    ];

    const threatData = [
        { name: 'Mon', threats: 12 },
        { name: 'Tue', threats: 19 },
        { name: 'Wed', threats: 3 },
        { name: 'Thu', threats: 5 },
        { name: 'Fri', threats: 2 },
        { name: 'Sat', threats: 0 },
        { name: 'Sun', threats: 9 },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get(ENDPOINTS.DASHBOARD.STATS);
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-muted-foreground animate-pulse">Loading secure dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Overview</h2>
                    <p className="text-muted-foreground">Global security posture and system health.</p>
                </div>
                <div className="flex space-x-2">
                    <Button>Download Report</Button>
                </div>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                        <Shield className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.active_agents || 0}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:border-destructive/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{stats?.total_alerts || 0}</div>
                        <p className="text-xs text-muted-foreground">+4 since last hour</p>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                        <p className="text-xs text-muted-foreground">Admin & Viewers</p>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize text-green-400">{stats?.system_status || 'Unknown'}</div>
                        <p className="text-xs text-muted-foreground">All systems operational</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Main Traffic Chart */}
                <Card className="col-span-4 hover:border-border transition-colors">
                    <CardHeader>
                        <CardTitle>Network Traffic</CardTitle>
                        <CardDescription>Inbound/Outbound traffic analysis over 24h.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="traffic"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorTraffic)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Threats Bar Chart */}
                <Card className="col-span-3 hover:border-border transition-colors">
                    <CardHeader>
                        <CardTitle>Threat Detections</CardTitle>
                        <CardDescription>Security incidents by day.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={threatData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Bar
                                    dataKey="threats"
                                    fill="currentColor"
                                    radius={[4, 4, 0, 0]}
                                    className="fill-destructive"
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>

            {/* Bottom Row - Activity & Map Placeholders */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest audit logs and user actions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <li key={i} className="flex items-center justify-between border-b last:border-0 border-border pb-2 last:pb-0">
                                    <div className="flex items-center space-x-3">
                                        <ArrowUpRight className="h-4 w-4 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium">User Login Success</p>
                                            <p className="text-xs text-muted-foreground">admin@sec.com via Web</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">2 min ago</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle>Live Threat Map</CardTitle>
                        <CardDescription>Real-time attack vectors.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[200px]">
                        <Globe className="h-16 w-16 text-primary/40 animate-pulse" />
                        <span className="ml-4 text-sm text-muted-foreground">Connecting to Global Intelligence...</span>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
