import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, PlayCircle, StopCircle, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { chaosService } from '@/lib/api';

interface Experiment {
    id: string;
    title: string;
    target: string;
    type: string;
    status: string;
    last_run: string;
    result: string;
}

export default function ChaosEngineering() {
    const [experiments, setExperiments] = useState<Experiment[]>([]);

    useEffect(() => {
        const mockExperiments: Experiment[] = [
            { id: '1', title: 'Kill Payment Pod', target: 'payment-service-v1', type: 'Pod Chaos', status: 'scheduled', last_run: '2023-11-15T10:00:00Z', result: 'pass' },
            { id: '2', title: 'Inject Network Latency', target: 'backend-api', type: 'Network Chaos', status: 'running', last_run: '2023-11-20T14:30:00Z', result: 'pending' },
            { id: '3', title: 'High CPU Load', target: 'worker-node-04', type: 'Stress Chaos', status: 'completed', last_run: '2023-11-18T09:15:00Z', result: 'pass' },
            { id: '4', title: 'DB Connection Saturation', target: 'postgres-primary', type: 'IO Chaos', status: 'completed', last_run: '2023-11-10T16:00:00Z', result: 'fail' },
            { id: '5', title: 'DNS Resolution Failure', target: 'coredns', type: 'Network Chaos', status: 'completed', last_run: '2023-11-05T11:20:00Z', result: 'pass' },
        ];

        const fetchExperiments = async () => {
            try {
                const response = await chaosService.getExperiments();
                if (response.data && response.data.length > 0) {
                    setExperiments(response.data);
                } else {
                    setExperiments(mockExperiments);
                }
            } catch (error) {
                console.warn("Using mock chaos experiments:", error);
                setExperiments(mockExperiments);
            }
        };
        fetchExperiments();
    }, []);

    const getResultIcon = (result: string) => {
        switch (result) {
            case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin-slow" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Chaos Engineering</h2>
                    <p className="text-muted-foreground">Test system resilience with controlled failures.</p>
                </div>
                <Button variant="destructive"><Zap className="mr-2 h-4 w-4" /> New Experiment</Button>
            </div>

            <div className="rounded-md border border-border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                    <div className="col-span-3">Experiment</div>
                    <div className="col-span-2">Target</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Last Run</div>
                    <div className="col-span-1 text-center">Result</div>
                </div>

                {experiments.map((exp) => (
                    <div key={exp.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors">
                        <div className="col-span-3 font-medium">{exp.title}</div>
                        <div className="col-span-2 font-mono text-xs text-muted-foreground">{exp.target}</div>
                        <div className="col-span-2 capitalize">{exp.type}</div>
                        <div className="col-span-2">
                            <Badge variant="outline" className={exp.status === 'running' ? 'animate-pulse border-blue-500 text-blue-500' : ''}>
                                {exp.status}
                            </Badge>
                        </div>
                        <div className="col-span-2 text-muted-foreground text-xs">{new Date(exp.last_run).toLocaleDateString()}</div>
                        <div className="col-span-1 flex justify-center">{getResultIcon(exp.result)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
