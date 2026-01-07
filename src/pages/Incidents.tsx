import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, GitMerge } from 'lucide-react';
import { incidentsService } from '@/lib/api';

interface Incident {
    id: string;
    title: string;
    affected_services: string[];
    impact_level: string;
    status: string;
}

export default function Incidents() {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        const mockIncidents: Incident[] = [
            { id: '1', title: 'Payment Gateway Capability Degraded', affected_services: ['Checkout API', 'Payment Service'], impact_level: 'Critical', status: 'Active' },
            { id: '2', title: 'High Latency in US-East Region', affected_services: ['Frontend-Web', 'Search Service'], impact_level: 'High', status: 'Investigating' },
            { id: '3', title: 'DDoS Attack on Public API', affected_services: ['API Gateway', 'WAF'], impact_level: 'Critical', status: 'Mitigated' },
            { id: '4', title: 'Internal Wiki Read-Only', affected_services: ['Confluence', 'Internal Docs'], impact_level: 'Low', status: 'Resolved' },
        ];

        const fetchIncidents = async () => {
            try {
                const response = await incidentsService.getIncidents();
                if (response.data && response.data.length > 0) {
                    setIncidents(response.data);
                } else {
                    setIncidents(mockIncidents);
                }
            } catch (error) {
                console.warn("Using mock incidents:", error);
                setIncidents(mockIncidents);
            }
        };
        fetchIncidents();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Incident Impact</h2>
                    <p className="text-muted-foreground">Post-mortem and impact analysis.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {incidents.map(inc => (
                    <Card key={inc.id}>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <Activity className="mr-2 h-5 w-5 text-red-500" />
                                {inc.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mb-4">
                                <div className="text-sm">Status: <span className="font-bold uppercase">{inc.status}</span></div>
                                <div className="text-sm">Impact: <span className="font-bold uppercase text-red-500">{inc.impact_level}</span></div>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">Affected Services:</div>
                            <div className="flex gap-2">
                                {inc.affected_services.map(s => (
                                    <span key={s} className="px-2 py-1 bg-secondary rounded text-xs">{s}</span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
