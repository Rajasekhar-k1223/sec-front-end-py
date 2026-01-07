import { useEffect, useState } from 'react';
import { agentsService } from '@/lib/api';
import { FileText, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LogEntry {
    id: string;
    timestamp: string;
    level: string;
    source: string;
    event: string;
    details: any;
}

interface AgentLogsViewerProps {
    agentId: string;
}

export default function AgentLogsViewer({ agentId }: AgentLogsViewerProps) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // setLoading(true); // Don't show loading on refresh to avoid flicker
                const response = await agentsService.getLogs(agentId);
                setLogs(response.data);
            } catch (error) {
                console.error("Failed to fetch logs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
        // Auto-refresh every 5 seconds for "Live Tail" feel
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, [agentId]);

    const getIcon = (level: string) => {
        switch (level.toLowerCase()) {
            case 'error':
            case 'critical': return <ShieldAlert className="h-4 w-4 text-red-500" />;
            case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            default: return <CheckCircle className="h-4 w-4 text-green-500" />;
        }
    };

    if (loading && logs.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">Loading security logs...</div>;
    }

    return (
        <div className="mt-4 bg-card/50 p-4 rounded-lg border border-border h-full flex flex-col">
            <h4 className="text-sm font-medium mb-4 text-foreground flex items-center">
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Security Event Log (Last 100)
            </h4>

            <div className="flex-1 min-h-[300px] border border-border rounded-md bg-black/40 p-2 font-mono text-xs">
                {logs.length === 0 ? (
                    <div className="text-muted-foreground text-center py-8">No security events detected recently.</div>
                ) : (
                    <ScrollArea className="h-[300px]">
                        <div className="space-y-1">
                            {logs.map((log) => (
                                <div key={log.id} className="flex space-x-2 py-1 border-b border-white/5 hover:bg-white/5 px-2">
                                    <span className="text-muted-foreground w-32 shrink-0">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </span>
                                    <span className="shrink-0 pt-0.5">
                                        {getIcon(log.level)}
                                    </span>
                                    <span className={`uppercase font-bold w-16 shrink-0 ${log.level === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
                                        {log.level}
                                    </span>
                                    <span className="text-foreground">
                                        [{log.source}] {log.event}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}
