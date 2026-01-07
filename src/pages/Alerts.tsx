import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertTriangle,
    ShieldAlert,
    CheckCircle,
    Clock,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { alertsService } from '@/lib/api';

// Alert Interface matching Backend Model
interface Alert {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'investigating' | 'resolved';
    source: string;
    created_at: string;
}

export default function Alerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await alertsService.getAlerts();
                setAlerts(response.data);
            } catch (error) {
                console.error("Failed to fetch alerts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            default: return 'text-muted-foreground';
        }
    };

    if (loading) {
        return <div className="p-8 text-muted-foreground">Loading alerts...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Alerts</h2>
                    <p className="text-muted-foreground">Real-time security incidents and threats.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                    <Button variant="destructive">Clear All</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Security Incidents ({alerts.length})</CardTitle>
                    <CardDescription>Prioritize and investigate detected anomalies.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {alerts.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
                                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
                                No active alerts. System is secure.
                            </div>
                        ) : (
                            alerts.map((alert) => (
                                <div key={alert.id} className="flex items-start justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/10 transition-colors">
                                    <div className="flex items-start space-x-4">
                                        <div className={cn("p-2 rounded-md border", getSeverityColor(alert.severity))}>
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-semibold text-foreground flex items-center">
                                                {alert.title}
                                                <span className={cn("ml-2 text-[10px] uppercase px-1.5 py-0.5 rounded border", getSeverityColor(alert.severity))}>
                                                    {alert.severity}
                                                </span>
                                            </h4>
                                            <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                                            <div className="flex items-center mt-2 space-x-4 text-xs text-muted-foreground">
                                                <div className="flex items-center">
                                                    <ShieldAlert className="h-3 w-3 mr-1" />
                                                    <span className="capitalize">{alert.source}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    <span>{new Date(alert.created_at).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <span className={cn("text-xs px-2 py-1 rounded-full uppercase font-medium",
                                            alert.status === 'open' ? 'text-blue-400 bg-blue-400/10' :
                                                alert.status === 'resolved' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'
                                        )}>
                                            {alert.status}
                                        </span>
                                        <Button variant="ghost" size="sm">Investigate</Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
