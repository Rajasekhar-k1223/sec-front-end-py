import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Globe, Mail, Laptop, Key, Database, ArrowRight, ShieldAlert } from 'lucide-react';
import { attackPathsService } from '@/lib/api';

const ICONS: any = { Globe, Mail, Laptop, Key, Database };

export default function AttackPaths() {
    const [pathData, setPathData] = useState<any>(null);

    useEffect(() => {
        const fetchPath = async () => {
            try {
                const response = await attackPathsService.getPath();
                setPathData(response.data);
            } catch (error) {
                console.error("Failed to fetch attack path", error);
            }
        };
        fetchPath();
    }, []);

    if (!pathData) return <div>Loading analysis...</div>;

    const steps = pathData.steps.map((s: any) => ({
        ...s,
        icon: ICONS[s.icon_name] || Globe,
        color: s.risk_level === 'critical' ? 'text-red-500' : s.risk_level === 'high' ? 'text-orange-500' : 'text-yellow-500'
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Attack Path Analysis</h2>
                    <p className="text-muted-foreground">Visualizing lateral movement and critical asset exposure.</p>
                </div>
            </div>

            <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-red-600">
                            <ShieldAlert className="mr-2 h-5 w-5" />
                            {pathData.title}
                        </CardTitle>
                        <Badge variant="destructive">Critical Risk ({pathData.risk_score}/10)</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative flex items-center justify-between py-12 px-4 overflow-x-auto">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 via-orange-500/50 to-yellow-500/50 -z-10 transform -translate-y-1/2" />

                        {steps.map((step: any, index: number) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.id} className="flex flex-col items-center bg-background p-4 rounded-lg border shadow-sm z-10 w-48 text-center space-y-2">
                                    <div className={`p-3 rounded-full bg-secondary ${step.color}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="font-semibold text-sm">{step.name}</h4>
                                    <Badge variant="outline" className="text-xs uppercase scale-90">
                                        {step.status.replace('_', ' ')}
                                    </Badge>
                                    {index < steps.length - 1 && (
                                        <ArrowRight className="absolute -right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hidden" />
                                        /* Arrow logic handled by line, simpler for flex */
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-md border bg-card">
                            <h4 className="font-medium mb-2">Remediation Plan</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {pathData.remediation.map((r: string, i: number) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-4 rounded-md border bg-card">
                            <h4 className="font-medium mb-2">Impact Analysis</h4>
                            <p className="text-sm text-muted-foreground">
                                {pathData.impact}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
