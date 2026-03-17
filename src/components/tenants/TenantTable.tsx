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
import { MoreHorizontal, Building, Users, Crown, Zap, Shield, Calendar, LogIn } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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
    onEdit?: (tenant: Tenant) => void;
    onDelete?: (tenant: Tenant) => void;
    onSuspend?: (tenant: Tenant) => void;
    onViewAgents?: (tenant: Tenant) => void;
    onImpersonate?: (tenant: Tenant) => void;
}

export default function TenantTable({
    tenants,
    onEdit,
    onDelete,
    onSuspend,
    onViewAgents,
    onImpersonate
}: TenantTableProps) {
    const statusColor = {
        active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        suspended: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        trial: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    };

    const getPlanIcon = (plan: string) => {
        if (plan === 'Enterprise') return <Crown className="w-3 h-3 mr-1 text-amber-500" />;
        if (plan === 'Unlimited') return <Zap className="w-3 h-3 mr-1 text-indigo-500" />;
        return <Shield className="w-3 h-3 mr-1 text-slate-400" />;
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
                                    {tenant.status?.toUpperCase() || 'ACTIVE'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1.5 min-w-[140px]">
                                    <div className="flex items-center justify-between text-[10px] font-medium uppercase text-muted-foreground">
                                        <div className="flex items-center">
                                            <Users className="w-3 h-3 mr-1" />
                                            Agents
                                        </div>
                                        <span>{Math.round((tenant.agentCount / tenant.agentLimit) * 100)}%</span>
                                    </div>
                                    <Progress
                                        value={(tenant.agentCount / tenant.agentLimit) * 100}
                                        className={cn(
                                            "h-1.5",
                                            (tenant.agentCount / tenant.agentLimit) > 0.9 ? "bg-rose-500/20" : "bg-primary/20"
                                        )}
                                        indicatorClassName={(tenant.agentCount / tenant.agentLimit) > 0.9 ? "bg-rose-500" : "bg-primary"}
                                    />
                                    <p className="text-[10px] text-muted-foreground text-right italic">
                                        {tenant.agentCount} of {tenant.agentLimit} used
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center text-xs font-semibold">
                                    {getPlanIcon(tenant.plan)}
                                    {tenant.plan}
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-[10px]">
                                <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1 opacity-50" />
                                    {tenant.createdAt}
                                </div>
                            </TableCell>
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
                                        <DropdownMenuItem onClick={() => onImpersonate?.(tenant)}>
                                            <LogIn className="w-4 h-4 mr-2" />
                                            Login as Tenant
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onEdit?.(tenant)}>Edit Details</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onViewAgents?.(tenant)}>View Agents</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onSuspend?.(tenant)} className="text-destructive">
                                            {tenant.status === 'suspended' ? 'Activate Tenant' : 'Suspend Tenant'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDelete?.(tenant)} className="text-destructive">
                                            Delete Tenant
                                        </DropdownMenuItem>
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
