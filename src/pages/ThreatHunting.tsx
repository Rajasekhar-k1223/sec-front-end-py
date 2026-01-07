import { useState, useEffect } from 'react';
import LogTable, { type LogEntry } from '@/components/threat-hunting/LogTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Clock, Save } from 'lucide-react';
import { threatHuntingService } from '@/lib/api';

export default function ThreatHunting() {
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const mockLogs: LogEntry[] = [
        { id: '1', timestamp: new Date().toISOString(), level: 'critical', source: 'Endpoint-05', event: 'Suspicious PowerShell Execution', message: 'powershell.exe -enc aW52b2tlLW1pbWlrYXR6' },
        { id: '2', timestamp: new Date(Date.now() - 300000).toISOString(), level: 'high', source: 'Firewall', event: 'C2 Beacon detected', message: 'Outbound connection to known C2 IP 45.33.22.11' },
        { id: '3', timestamp: new Date(Date.now() - 600000).toISOString(), level: 'medium', source: 'Auth', event: 'Privilege Escalation Attempt', message: 'User "guest" attempted to access /etc/shadow' },
        { id: '4', timestamp: new Date(Date.now() - 900000).toISOString(), level: 'low', source: 'System', event: 'Service Stopped', message: 'Print Spooler service stopped unexpectedly' },
        { id: '5', timestamp: new Date(Date.now() - 1200000).toISOString(), level: 'info', source: 'Network', event: 'Large File Transfer', message: '10GB transferred to internal backup server' },
    ];

    const fetchLogs = async (query = '') => {
        try {
            const response = await threatHuntingService.searchLogs(query);
            if (response.data && response.data.length > 0) {
                setLogs(response.data);
            } else {
                setLogs(mockLogs);
            }
        } catch (error) {
            console.warn("Using mock threat logs:", error);
            setLogs(mockLogs);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSearch = () => {
        fetchLogs(searchTerm);
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Threat Hunting</h2>
                    <p className="text-muted-foreground">Advanced query interface for security logs and events.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Save className="mr-2 h-4 w-4" /> Save Query</Button>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                </div>
            </div>

            {/* Search Section */}
            <div className="flex items-center space-x-2 bg-card p-4 rounded-md border border-border">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9 font-mono text-sm"
                        placeholder="event.id: * AND source: firewall..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button variant="secondary"><Clock className="mr-2 h-4 w-4" /> Last 24 Hours</Button>
                <Button onClick={handleSearch}>Search</Button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col bg-card rounded-md border border-border">
                <div className="p-2 border-b border-border bg-secondary/20 flex justify-between items-center px-4">
                    <span className="text-xs text-muted-foreground">Showing {logs.length} events</span>
                    <span className="text-xs font-mono text-muted-foreground">Took 42ms</span>
                </div>
                <div className="flex-1 overflow-auto p-0">
                    <LogTable logs={logs} />
                </div>
            </div >
        </div >
    );
}
