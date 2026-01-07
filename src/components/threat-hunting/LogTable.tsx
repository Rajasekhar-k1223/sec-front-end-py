import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export interface LogEntry {
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    source: string;
    event: string;
    details: Record<string, any>;
}

interface LogTableProps {
    logs: LogEntry[];
}

export default function LogTable({ logs }: LogTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const levelColor = {
        info: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
        warning: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
        error: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
        critical: 'bg-red-900/10 text-red-900 border-red-500 hover:bg-red-900/20',
    };

    return (
        <div className="rounded-md border border-border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="w-[180px]">Timestamp</TableHead>
                        <TableHead className="w-[100px]">Level</TableHead>
                        <TableHead className="w-[150px]">Source</TableHead>
                        <TableHead>Event</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <>
                            <TableRow key={log.id} className="cursor-pointer hover:bg-secondary/30" onClick={() => toggleRow(log.id)}>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                                        {expandedRows.has(log.id) ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </Button>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={levelColor[log.level]}>
                                        {log.level.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell>{log.source}</TableCell>
                                <TableCell className="font-medium">{log.event}</TableCell>
                            </TableRow>
                            {expandedRows.has(log.id) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="bg-secondary/10 p-4">
                                        <pre className="text-xs font-mono bg-background p-4 rounded-md overflow-x-auto border border-border">
                                            {JSON.stringify(log.details, null, 2)}
                                        </pre>
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
