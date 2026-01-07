import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { agentsService } from '@/lib/api';
import { Activity } from 'lucide-react';

interface Metric {
    timestamp: string;
    cpu_percent: number;
    memory_percent: number;
    disk_percent: number;
}

interface AgentMetricsChartProps {
    agentId: string;
}

export default function AgentMetricsChart({ agentId }: AgentMetricsChartProps) {
    const [data, setData] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const response = await agentsService.getMetrics(agentId);
                // API returns latest first. Reverse for chronological chart.
                const chronological = response.data.reverse();
                setData(chronological);
            } catch (error) {
                console.error("Failed to fetch metrics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();

        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchMetrics, 10000);
        return () => clearInterval(interval);
    }, [agentId]);

    if (loading && data.length === 0) {
        return <div className="p-8 text-center text-muted-foreground flex items-center justify-center"><Activity className="animate-spin mr-2 h-4 w-4" /> Loading Metrics...</div>;
    }

    if (data.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">No metrics available for this agent yet.</div>;
    }

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="h-[300px] w-full mt-4 bg-card/50 p-4 rounded-lg border border-border">
            <h4 className="text-sm font-medium mb-4 text-foreground flex items-center">
                <Activity className="mr-2 h-4 w-4 text-primary" />
                Live System Performance (Last 100 Ticks)
            </h4>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatTime}
                        stroke="#888"
                        fontSize={12}
                    />
                    <YAxis stroke="#888" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                        labelFormatter={(label) => formatTime(label)}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="cpu_percent"
                        name="CPU %"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="memory_percent"
                        name="RAM %"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="disk_percent"
                        name="Disk %"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
