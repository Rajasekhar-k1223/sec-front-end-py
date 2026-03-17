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
    financial_impact?: number;
    user_impact?: number;
    analysis_summary?: string;
}

export default function Incidents() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [analyzing, setAnalyzing] = useState<string | null>(null);

    const fetchIncidents = async () => {
        try {
            const response = await incidentsService.getIncidents();
            if (response.data && response.data.length > 0) {
                setIncidents(response.data);
            }
        } catch (error) {
            console.warn("Using mock incidents:", error);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    const handleAnalyze = async (id: string) => {
        setAnalyzing(id);
        try {
            const response = await incidentsService.analyzeIncident(id);
            // innovative refresh - update local state instead of refetching
            setIncidents(prev => prev.map(inc => inc.id === id ? response.data : inc));
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setAnalyzing(null);
        }
    };

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
                            <CardTitle className="text-lg flex items-center justify-between">
                                <div className="flex items-center">
                                    <Activity className="mr-2 h-5 w-5 text-red-500" />
                                    {inc.title}
                                </div>
                                {!inc.financial_impact && (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleAnalyze(inc.id)}
                                        disabled={analyzing === inc.id}
                                    >
                                        {analyzing === inc.id ? "Analyzing..." : "Analyze Impact"}
                                    </Button>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mb-4">
                                <div className="text-sm">Status: <span className="font-bold uppercase">{inc.status}</span></div>
                                <div className="text-sm">Impact: <span className="font-bold uppercase text-red-500">{inc.impact_level}</span></div>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">Affected Services:</div>
                            <div className="flex gap-2 mb-4">
                                {inc.affected_services.map(s => (
                                    <span key={s} className="px-2 py-1 bg-secondary rounded text-xs">{s}</span>
                                ))}
                            </div>

                            {/* Analysis Result */}
                            {inc.financial_impact && (
                                <div className="bg-secondary/10 border border-secondary p-4 rounded-md animate-in fade-in slide-in-from-top-2">
                                    <h4 className="font-bold text-sm mb-2 flex items-center"><GitMerge className="mr-2 h-4 w-4" /> AI Impact Assessment</h4>
                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                        <div>
                                            <div className="text-xs text-muted-foreground">Estimated Financial Loss</div>
                                            <div className="text-xl font-mono text-red-500">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inc.financial_impact)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Affected Users</div>
                                            <div className="text-xl font-mono">{inc.user_impact?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground italic">{inc.analysis_summary}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
