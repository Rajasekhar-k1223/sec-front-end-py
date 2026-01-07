import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Shield,
    Server,
    Activity,
    Download,
    Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { agentsService } from '@/lib/api';
import AgentMetricsChart from '@/components/dashboard/AgentMetricsChart';
import AgentSoftwareTable from '@/components/dashboard/AgentSoftwareTable';
import AgentLogsViewer from '@/components/dashboard/AgentLogsViewer';

// Agent Interface matching Backend Model
interface Agent {
    id: string;
    hostname: string;
    ip_address: string;
    os: string;
    os_version: string;
    version: string;
    status: 'online' | 'offline' | 'warning';
    last_seen: string;
}

export default function Agents() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await agentsService.getAgents();
                setAgents(response.data);
            } catch (error) {
                console.error("Failed to fetch agents", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
        // Refresh list occasionally too
        const interval = setInterval(fetchAgents, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedAgentId(expandedAgentId === id ? null : id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'text-green-500 bg-green-500/10';
            case 'warning': return 'text-yellow-500 bg-yellow-500/10';
            case 'offline': return 'text-muted-foreground bg-secondary';
            default: return 'text-muted-foreground';
        }
    };

    const getOsIcon = (os: string) => {
        // Simple icon mapping (could be expanded)
        if (os.toLowerCase().includes('windows')) return <Server className="h-4 w-4" />;
        if (os.toLowerCase().includes('linux')) return <Server className="h-4 w-4" />;
        return <Server className="h-4 w-4" />;
    }

    if (loading) {
        return <div className="p-8 text-muted-foreground">Loading agents...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Agents</h2>
                    <p className="text-muted-foreground">Manage and monitor deployed security agents.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download Installer</Button>
                    <Button>+ Add Agent</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Deployed Agents ({agents.length})</CardTitle>
                    <CardDescription>List of all agents currently reporting to the central server.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border">
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                            <div className="col-span-3">Hostname / ID</div>
                            <div className="col-span-2">IP Address</div>
                            <div className="col-span-2">OS</div>
                            <div className="col-span-2">Version</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-1 text-right">Last Seen</div>
                        </div>

                        {agents.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No agents connected yet. Download the installer to get started.
                            </div>
                        ) : (
                            agents.map((agent) => (
                                <div key={agent.id} className="border-b border-border last:border-0 hover:bg-secondary/5 transition-colors">
                                    <div
                                        className="grid grid-cols-12 gap-4 p-4 items-center text-sm cursor-pointer"
                                        onClick={() => toggleExpand(agent.id)}
                                    >
                                        <div className="col-span-3">
                                            <div className="font-medium text-foreground flex items-center space-x-2">
                                                <Shield className="h-4 w-4 text-primary" />
                                                <span>{agent.hostname}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground break-all">{agent.id}</div>
                                        </div>
                                        <div className="col-span-2 text-muted-foreground font-mono">{agent.ip_address}</div>
                                        <div className="col-span-2 flex items-center space-x-2">
                                            {getOsIcon(agent.os)}
                                            <span className="capitalize">{agent.os} {agent.os_version}</span>
                                        </div>
                                        <div className="col-span-2 text-muted-foreground">v{agent.version}</div>
                                        <div className="col-span-2">
                                            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase flex w-fit items-center space-x-1", getStatusColor(agent.status))}>
                                                {agent.status === 'online' && <Activity className="h-3 w-3 mr-1" />}
                                                {agent.status}
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-right text-xs text-muted-foreground">
                                            <div className="flex items-center justify-end space-x-1" title={agent.last_seen}>
                                                <Clock className="h-3 w-3" />
                                                <span>{new Date(agent.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Detail Row */}
                                    {expandedAgentId === agent.id && (
                                        <div className="p-4 bg-secondary/10 border-t border-border">
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex space-x-2 border-b border-border">
                                                    <div className="pb-2 cursor-pointer border-b-2 border-primary font-medium text-sm">Overview</div>
                                                    {/* TODO: Add proper Tabs component later for cleaner switching */}
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    <div>
                                                        <AgentMetricsChart agentId={agent.id} />
                                                    </div>
                                                    <div>
                                                        <AgentSoftwareTable agentId={agent.id} />
                                                    </div>
                                                </div>

                                                <div>
                                                    <AgentLogsViewer agentId={agent.id} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
