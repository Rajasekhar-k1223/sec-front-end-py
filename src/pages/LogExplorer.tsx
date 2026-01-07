import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, RefreshCw, Filter } from 'lucide-react';
// Reuse threat hunting service for logs as backend is shared for now
import { threatHuntingService } from '@/lib/api';

export default function LogExplorer() {
    const [searchQuery, setSearchQuery] = useState('');
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const mockLogs = [
        { id: '1', timestamp: new Date().toISOString(), level: 'critical', source: 'AuthService', event: 'Failed Login', details: { ip: '192.168.1.50', reason: 'Brute Force' } },
        { id: '2', timestamp: new Date(Date.now() - 60000).toISOString(), level: 'warning', source: 'Node-01', event: 'High CPU Usage', details: { usage: '92%', process: 'java.exe' } },
        { id: '3', timestamp: new Date(Date.now() - 120000).toISOString(), level: 'info', source: 'AuditLog', event: 'User Login', details: { user: 'admin', ip: '10.0.0.5' } },
        { id: '4', timestamp: new Date(Date.now() - 180000).toISOString(), level: 'error', source: 'DbCluster', event: 'Connection Timeout', details: { db: 'replica-2', latency: '5003ms' } },
        { id: '5', timestamp: new Date(Date.now() - 300000).toISOString(), level: 'info', source: 'Network', event: 'Firewall Rule Updated', details: { rule_id: 'FW-8822', action: 'allow' } },
        { id: '6', timestamp: new Date(Date.now() - 600000).toISOString(), level: 'warning', source: 'AppGateway', event: 'Rate Limit Exceeded', details: { client_id: 'service-x', limit: '1000/min' } },
    ];

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            // Attempt real fetch
            const response = await threatHuntingService.searchLogs(searchQuery);
            if (response.data && response.data.length > 0) {
                setLogs(response.data);
            } else {
                // Fallback to mock logs if search is empty or API empty
                setLogs(mockLogs.filter(l =>
                    !searchQuery ||
                    l.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    l.level.includes(searchQuery.toLowerCase())
                ));
            }
        } catch (error) {
            console.warn("API unavailable, using mock data:", error);
            setLogs(mockLogs.filter(l =>
                !searchQuery ||
                l.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.level.includes(searchQuery.toLowerCase())
            ));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Log Explorer</h2>
                    <p className="text-muted-foreground mt-2">Search and analyze system and security logs.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
                    <Button onClick={fetchLogs}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search logs (e.g., 'error', 'login', '192.168.1.1')..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
                            />
                        </div>
                        <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                                <tr>
                                    <th className="p-3">Timestamp</th>
                                    <th className="p-3">Level</th>
                                    <th className="p-3">Source</th>
                                    <th className="p-3">Event</th>
                                    <th className="p-3">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={5} className="p-8 text-center">Loading logs...</td></tr>
                                ) : logs.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No logs found matching your criteria.</td></tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="border-b last:border-0 hover:bg-muted/10">
                                            <td className="p-3 font-mono text-xs whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border
                                                    ${log.level === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        log.level === 'error' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                            log.level === 'warning' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                                'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                                    {log.level.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-3">{log.source}</td>
                                            <td className="p-3 font-medium">{log.event}</td>
                                            <td className="p-3 font-mono text-xs text-muted-foreground max-w-xs truncate">
                                                {JSON.stringify(log.details)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
