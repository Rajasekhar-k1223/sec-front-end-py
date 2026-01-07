import { Handle, Position } from 'reactflow';
import { Shield, Server, Database, Globe, Laptop, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
    'firewall': Shield,
    'server': Server,
    'database': Database,
    'internet': Globe,
    'pce': Laptop,
    'cloud': Cloud
};

interface CustomNodeProps {
    data: {
        label: string;
        type: string;
        status: 'healthy' | 'warning' | 'critical';
        ip?: string;
    }
}

export default function CustomNode({ data }: CustomNodeProps) {
    const Icon = iconMap[data.type] || Server;

    return (
        <div className={cn(
            "px-4 py-2 shadow-md rounded-md border-2 bg-card min-w-[150px]",
            data.status === 'healthy' && "border-green-500",
            data.status === 'warning' && "border-yellow-500",
            data.status === 'critical' && "border-destructive",
            "transition-all hover:scale-105 hover:shadow-lg"
        )}>
            <div className="flex items-center">
                <div className={cn(
                    "rounded-full p-2 mr-3",
                    data.status === 'healthy' && "bg-green-500/10 text-green-500",
                    data.status === 'warning' && "bg-yellow-500/10 text-yellow-500",
                    data.status === 'critical' && "bg-destructive/10 text-destructive",
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-sm font-bold text-foreground">{data.label}</div>
                    <div className="text-xs text-muted-foreground">{data.ip}</div>
                </div>
            </div>

            <Handle type="target" position={Position.Top} className="!bg-muted-foreground w-3 h-3" />
            <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground w-3 h-3" />
        </div>
    );
}
