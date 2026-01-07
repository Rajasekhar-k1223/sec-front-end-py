import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ShieldCheck, AlertTriangle } from 'lucide-react';
import { aiGovernanceService } from '@/lib/api';

interface AIModel {
    id: string;
    name: string;
    version: string;
    risk_score: number;
    compliance_status: string;
    last_audit: string;
}

export default function AiGovernance() {
    const [models, setModels] = useState<AIModel[]>([]);

    useEffect(() => {
        const mockModels: AIModel[] = [
            { id: '1', name: 'Customer Support Bot', version: 'v2.1.0', risk_score: 12, compliance_status: 'compliant', last_audit: '2023-11-20' },
            { id: '2', name: 'Fraud Detection Model', version: 'v1.0.5', risk_score: 45, compliance_status: 'compliant', last_audit: '2023-11-15' },
            { id: '3', name: 'Resume Screener AI', version: 'beta-3', risk_score: 88, compliance_status: 'non_compliant', last_audit: '2023-11-10' },
            { id: '4', name: 'Internal Knowledge Search', version: 'v4.2', risk_score: 5, compliance_status: 'compliant', last_audit: '2023-11-18' },
            { id: '5', name: 'Marketing Copy Generator', version: 'v1.1', risk_score: 30, compliance_status: 'review_needed', last_audit: '2023-11-01' },
        ];

        const fetchModels = async () => {
            try {
                const response = await aiGovernanceService.getModels();
                if (response.data && response.data.length > 0) {
                    setModels(response.data);
                } else {
                    setModels(mockModels);
                }
            } catch (error) {
                console.warn("Using mock AI models:", error);
                setModels(mockModels);
            }
        };
        fetchModels();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">AI Governance</h2>
                    <p className="text-muted-foreground">Monitor AI model compliance, bias, and risk.</p>
                </div>
                <Button>+ Register Model</Button>
            </div>

            <div className="rounded-md border border-border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                    <div className="col-span-4">Model Name</div>
                    <div className="col-span-2">Version</div>
                    <div className="col-span-2">Risk Score</div>
                    <div className="col-span-2">Compliance</div>
                    <div className="col-span-2 text-right">Last Audit</div>
                </div>

                {models.map((model) => (
                    <div key={model.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors">
                        <div className="col-span-4 font-medium flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <span>{model.name}</span>
                        </div>
                        <div className="col-span-2 font-mono text-xs">{model.version}</div>
                        <div className="col-span-2">
                            <span className={`font-bold ${model.risk_score > 50 ? 'text-red-500' : 'text-green-500'}`}>
                                {model.risk_score}/100
                            </span>
                        </div>
                        <div className="col-span-2 capitalize">
                            <Badge variant={model.compliance_status === 'compliant' ? 'outline' : 'destructive'}>
                                {model.compliance_status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <div className="col-span-2 text-right text-muted-foreground text-xs">{model.last_audit}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
