import { useState, useEffect } from 'react';
import AuditTable, { type AuditLogEntry } from '@/components/audit/AuditTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auditService } from '@/lib/api';

export default function AuditLogs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await auditService.getLogs(searchTerm);
                // Map fields if necessary: backend uses snake_case, frontend might expect camelCase
                // Check AuditTable definition. If it expects 'ipAddress', map 'ip_address' to it.
                // Looking at previous valid props, AuditLogEntry had 'ipAddress'.
                // Backend sends 'ip_address'.
                const mappedLogs = response.data.map((log: any) => ({
                    ...log,
                    ipAddress: log.ip_address
                }));
                setLogs(mappedLogs);
            } catch (error) {
                console.error("Failed to fetch audit logs:", error);
            }
        };
        // Debounce could be added here, but for now fetch on change is fine for local mock
        const timer = setTimeout(() => fetchLogs(), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Audit Logs</h2>
                    <p className="text-muted-foreground">Immutable record of all system activities.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Dec 31, 2025</Button>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,245</div>
                        <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Actors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">Deletions/Modifications</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">3</div>
                        <p className="text-xs text-muted-foreground">Access Denied</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border bg-card">
                <CardContent className="p-4 flex space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Search by Actor or Action..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                </CardContent>
            </Card>

            <div className="flex-1 overflow-hidden border rounded-md">
                <AuditTable logs={logs} />
            </div>
        </div>
    );
}
