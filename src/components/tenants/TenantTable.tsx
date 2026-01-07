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
import { MoreHorizontal, Building, Users } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Tenant {
    id: string;
    name: string;
    status: 'active' | 'suspended' | 'trial';
    agentCount: number;
    agentLimit: number;
    plan: string;
    createdAt: string;
}

interface TenantTableProps {
    tenants: Tenant[];
}

export default function TenantTable({ tenants }: TenantTableProps) {
    const statusColor = {
        active: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
        suspended: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
        trial: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
    };

    return (
        <div className="rounded-md border border-border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Tenant Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Agents / Quota</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center">
                                    <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                                    {tenant.name}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={statusColor[tenant.status]}>
                                    {tenant.status.toUpperCase()}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center text-sm">
                                    <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span className={tenant.agentCount > tenant.agentLimit ? "text-destructive font-bold" : ""}>
                                        {tenant.agentCount}
                                    </span>
                                    <span className="text-muted-foreground mx-1">/</span>
                                    {tenant.agentLimit}
                                </div>
                            </TableCell>
                            <TableCell>{tenant.plan}</TableCell>
                            <TableCell className="text-muted-foreground text-xs">{tenant.createdAt}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                        <DropdownMenuItem>View Agents</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">Suspend Tenant</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
