import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, User } from 'lucide-react';

interface Incident {
    id: string;
    title: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    assignedTo?: string;
    description: string;
    timestamp: string;
}

interface IncidentCardProps {
    incident: Incident;
}

export default function IncidentCard({ incident }: IncidentCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: incident.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const severityColor = {
        critical: 'bg-red-500 hover:bg-red-600',
        high: 'bg-orange-500 hover:bg-orange-600',
        medium: 'bg-yellow-500 hover:bg-yellow-600',
        low: 'bg-blue-500 hover:bg-blue-600',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3">
            <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                <CardHeader className="p-3 pb-0 space-y-0">
                    <div className="flex justify-between items-start">
                        <Badge variant="secondary" className={`${severityColor[incident.severity]} text-white border-none text-[10px] px-1.5 py-0`}>
                            {incident.severity.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {incident.timestamp}
                        </span>
                    </div>
                    <CardTitle className="text-sm font-medium mt-2 leading-tight">
                        {incident.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {incident.description}
                    </p>
                    {incident.assignedTo && (
                        <div className="flex items-center text-xs text-muted-foreground">
                            <User className="w-3 h-3 mr-1" />
                            {incident.assignedTo}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
