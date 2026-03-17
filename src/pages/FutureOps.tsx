import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

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

    useEffect(() => {
        fetchData();
    }, []);

    const [doctorSystems, setDoctorSystems] = useState<any[]>([]);
    const [doctorLoading, setDoctorLoading] = useState(false);
    const [healLoading, setHealLoading] = useState<Record<string, boolean>>({});

    const fetchDoctor = async () => {
        setDoctorLoading(true);
        try {
            const res = await futureOpsService.getHealth();
            setDoctorSystems(res.data);
        } catch (error) {
            console.error("Failed to fetch doctor stats", error);
        } finally {
            setDoctorLoading(false);
        }
    };

    // Initial fetch for doctor when tab changes could be handled, but fetching all for now in useEffect
    useEffect(() => {
        fetchData();
        fetchDoctor();
    }, []);

    const handleApprove = async (predId: string) => {
        setLoadingMap(prev => ({ ...prev, [predId]: true }));
        try {
            await futureOpsService.runMitigation(predId);
            await fetchData(); // Refresh list after mitigation
        } catch (error) {
            console.error("Mitigation Failed", error);
        } finally {
            setLoadingMap(prev => ({ ...prev, [predId]: false }));
        }
    };

    const handleHeal = async (sysId: string, issue: string) => {
        setHealLoading(prev => ({ ...prev, [sysId]: true }));
        try {
            await futureOpsService.healSystem(sysId, issue);
            await fetchDoctor(); // Refresh status
        } catch (error) {
            console.error("Heal failed", error);
        } finally {
            setHealLoading(prev => ({ ...prev, [sysId]: false }));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Future Ops</h2>
            <p className="text-muted-foreground">Predictive analysis, system health, and autonomous self-healing.</p>

            <div className="flex space-x-4 mb-4 border-b border-border pb-2">
                {/* Simple Tab Switcher (Visual only for now, can implement Tabs component properly) */}
                <Button variant="ghost" className="font-semibold text-primary">Overview</Button>
            </div>

            <div className="space-y-8">
                {/* Doctor Section */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-500" />
                            Infrastructure Doctor
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {doctorSystems.map(sys => (
                                <div key={sys.id} className={`p-4 rounded-lg border ${sys.status === 'healthy' ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium">{sys.name}</div>
                                        <Badge variant={sys.status === 'healthy' ? "outline" : "destructive"}>
                                            {sys.status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground space-y-1 mb-4">
                                        <div className="flex justify-between"><span>CPU</span> <span>{sys.cpu_usage}%</span></div>
                                        <div className="flex justify-between"><span>Mem</span> <span>{sys.memory_usage}%</span></div>
                                        {sys.issues?.length > 0 && (
                                            <div className="mt-2 text-red-500 font-medium text-xs">
                                                detected: {sys.issues.join(", ")}
                                            </div>
                                        )}
                                    </div>
                                    {sys.status !== 'healthy' && (
                                        <Button
                                            size="sm"
                                            className="w-full bg-red-600 hover:bg-red-700"
                                            onClick={() => handleHeal(sys.id, sys.issues[0])}
                                            disabled={healLoading[sys.id]}
                                        >
                                            {healLoading[sys.id] ? <Sparkles className="h-3 w-3 mr-1 animate-spin" /> : <Zap className="h-3 w-3 mr-1" />}
                                            {healLoading[sys.id] ? "Healing..." : "Heal System"}
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

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
                                                <Badge variant={pred.status === 'Pending' ? 'outline' : 'secondary'} className="mt-1 text-[10px]">
                                                    {pred.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <div>
                                                <div className="text-lg font-bold text-amber-500">{pred.probability}%</div>
                                                <span className="text-[10px] uppercase text-muted-foreground">Probability</span>
                                            </div>
                                            {pred.status === 'Pending' && (
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    className="h-7 text-xs bg-amber-600 hover:bg-amber-700"
                                                    onClick={() => handleApprove(pred.id)}
                                                    disabled={loadingMap[pred.id]}
                                                >
                                                    {loadingMap[pred.id] ? 'Mitigating...' : 'Approve Action'}
                                                </Button>
                                            )}
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
        </div>
    );
}
