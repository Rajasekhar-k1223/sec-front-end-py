import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Activity, Cpu, HardDrive, Zap } from 'lucide-react';

interface Prediction {
    id: string;
    target: string;
    issue: string;
    probability: number;
    timeframe: string;
    status: 'Pending' | 'Mitigated' | 'Ignored';
}

interface AutoAction {
    id: string;
    action: string;
    reason: string;
    timestamp: string;
    outcome: 'Success' | 'Failed';
}

import { futureOpsService } from '@/lib/api';

export default function FutureOps() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [actions, setActions] = useState<AutoAction[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [predRes, actRes] = await Promise.all([
                    futureOpsService.getPredictions(),
                    futureOpsService.getActions()
                ]);
                setPredictions(predRes.data);
                setActions(actRes.data);
            } catch (error) {
                console.error("Failed", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Future Ops</h2>
            <p className="text-muted-foreground">Predictive analysis and autonomous self-healing infrastructure managed by AI agents.</p>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            AI Predictive Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {predictions.map((pred) => (
                                <div key={pred.id} className="flex items-center justify-between border-1 border-secondary p-3 rounded-lg bg-secondary/10">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-amber-500/10 p-2 rounded-full mt-1">
                                            {pred.issue.includes('Disk') ? <HardDrive className="h-4 w-4 text-amber-500" /> :
                                                pred.issue.includes('Memory') ? <Cpu className="h-4 w-4 text-amber-500" /> :
                                                    <Activity className="h-4 w-4 text-amber-500" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{pred.issue}</p>
                                            <p className="text-xs text-muted-foreground">Target: {pred.target} • {pred.timeframe}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-amber-500">{pred.probability}%</div>
                                        <span className="text-[10px] uppercase text-muted-foreground">Probability</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-blue-500" />
                            Autonomous Actions Log
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative border-l border-border ml-2 space-y-6">
                            {actions.map((act) => (
                                <div key={act.id} className="ml-6 relative">
                                    <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-blue-500 border border-background ring-4 ring-background" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{act.action}</span>
                                        <span className="text-xs text-muted-foreground">{act.reason}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[10px] h-5">{act.timestamp}</Badge>
                                            <Badge variant="secondary" className="text-[10px] h-5 text-green-600 bg-green-500/10">{act.outcome}</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
