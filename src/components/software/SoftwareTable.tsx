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
import { ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react';

export interface SoftwareEntry {
    id: string;
    name: string;
    vendor: string;
    version: string;
    installCount: number;
    vulnerabilities: number;
    riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
}

interface SoftwareTableProps {
    software: SoftwareEntry[];
}

export default function SoftwareTable({ software }: SoftwareTableProps) {
    const riskColor = {
        safe: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
        low: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
        medium: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
        high: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
        critical: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    };

    return (
        <div className="rounded-md border border-border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">Software Name</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Installs</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {software.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center">
                                    {item.riskLevel === 'safe' ? (
                                        <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
                                    ) : (
                                        <ShieldAlert className="w-4 h-4 mr-2 text-muted-foreground" />
                                    )}
                                    {item.name}
                                </div>
                            </TableCell>
                            <TableCell>{item.vendor}</TableCell>
                            <TableCell className="font-mono text-xs">{item.version}</TableCell>
                            <TableCell>{item.installCount}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={riskColor[item.riskLevel]}>
                                    {item.riskLevel.toUpperCase()}
                                    {item.vulnerabilities > 0 && ` (${item.vulnerabilities} CVEs)`}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Uninstall
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
