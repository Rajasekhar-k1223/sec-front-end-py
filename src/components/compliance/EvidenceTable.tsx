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
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export interface EvidenceItem {
    id: string;
    controlId: string;
    description: string;
    evidenceName: string;
    status: 'collected' | 'missing' | 'review_needed';
    lastUpdated: string;
}

interface EvidenceTableProps {
    evidence: EvidenceItem[];
}

export default function EvidenceTable({ evidence }: EvidenceTableProps) {
    const statusColor = {
        collected: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
        missing: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
        review_needed: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    };

    return (
        <div className="rounded-md border border-border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Control ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Required Evidence</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {evidence.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-mono text-xs">{item.controlId}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-primary" />
                                    {item.evidenceName}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={statusColor[item.status]}>
                                    {item.status === 'collected' && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {item.status === 'missing' && <AlertCircle className="w-3 h-3 mr-1" />}
                                    {item.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{item.lastUpdated}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                    <Upload className="w-3 h-3 mr-2" />
                                    Upload
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
