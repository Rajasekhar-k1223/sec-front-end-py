import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, Activity, Monitor, Clock } from 'lucide-react';

export interface AuditLogEntry {
    id: string;
    actor: string;
    action: string;
    resource: string;
    ipAddress: string;
    status: 'success' | 'failure';
    timestamp: string;
}

interface AuditTableProps {
    logs: AuditLogEntry[];
}

export default function AuditTable({ logs }: AuditTableProps) {
    return (
        <div className="rounded-md border border-border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[180px]">Actor</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center">
                                    <User className="w-3 h-3 mr-2 text-muted-foreground" />
                                    {log.actor}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Activity className="w-3 h-3 mr-2 text-muted-foreground" />
                                    {log.action}
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{log.resource}</TableCell>
                            <TableCell className="text-xs text-muted-foreground flex items-center">
                                <Monitor className="w-3 h-3 mr-1" />
                                {log.ipAddress}
                            </TableCell>
                            <TableCell>
                                <Badge variant={log.status === 'success' ? 'outline' : 'destructive'} className={log.status === 'success' ? 'text-green-500 border-green-500/20 bg-green-500/10' : ''}>
                                    {log.status.toUpperCase()}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground font-mono">
                                {log.timestamp}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
