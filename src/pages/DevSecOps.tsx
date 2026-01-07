import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Play, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { devSecOpsService } from '@/lib/api';

export default function DevSecOps() {
    const [pipelines, setPipelines] = useState<any[]>([]);

    useEffect(() => {
        const mockPipelines = [
            { id: 1, name: 'frontend-web-ci', branch: 'main', status: 'success', duration: '5m 12s', security_issues: 0 },
            { id: 2, name: 'backend-api-ci', branch: 'feat/user-auth', status: 'failed', duration: '3m 45s', security_issues: 2 },
            { id: 3, name: 'payment-svc-deploy', branch: 'release/v2.1', status: 'running', duration: '1m 20s', security_issues: 0 },
            { id: 4, name: 'data-processing-etl', branch: 'dev', status: 'success', duration: '8m 30s', security_issues: 5 },
            { id: 5, name: 'audit-log-service', branch: 'main', status: 'success', duration: '4m 10s', security_issues: 0 },
        ];

        const fetchPipelines = async () => {
            // Helper to process data
            const processData = (data: any[]) => data.map((p: any) => ({
                id: p.id,
                name: p.name,
                branch: p.branch,
                status: p.status,
                duration: p.duration,
                securityIssues: p.security_issues || 0 // handle undefined mapping
            }));

            try {
                const response = await devSecOpsService.getPipelines();
                if (response.data && response.data.length > 0) {
                    setPipelines(processData(response.data));
                } else {
                    setPipelines(processData(mockPipelines));
                }
            } catch (error) {
                console.warn("Using mock pipelines:", error);
                setPipelines(processData(mockPipelines));
            }
        };
        fetchPipelines();
    }, []);

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">DevSecOps & DORA</h2>
                    <p className="text-muted-foreground">Software Delivery Performance and Security Pipelines.</p>
                </div>
                <div className="flex space-x-2">
                    <Button><Play className="mr-2 h-4 w-4" /> Trigger Build</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Charts moved to DORA Metrics page */}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Pipelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pipeline</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Security</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pipelines.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{p.name}</span>
                                                <span className="text-xs text-muted-foreground flex items-center">
                                                    <GitBranch className="w-3 h-3 mr-1" />
                                                    {p.branch}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                p.status === 'success' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' :
                                                    p.status === 'failed' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' :
                                                        'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
                                            }>
                                                {p.status === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {p.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                                                {p.status === 'running' && <Clock className="w-3 h-3 mr-1 animate-spin" />}
                                                {p.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{p.duration}</TableCell>
                                        <TableCell>
                                            {p.securityIssues > 0 ? (
                                                <Badge variant="destructive" className="flex items-center w-fit">
                                                    <ShieldAlert className="w-3 h-3 mr-1" />
                                                    {p.securityIssues} Issues
                                                </Badge>
                                            ) : (
                                                <span className="text-green-500 text-xs flex items-center">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Clean
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Security Gates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="space-y-1">
                                    <p className="font-medium">Static Analysis (SAST)</p>
                                    <p className="text-sm text-muted-foreground">SonarQube • Blocking Criticals</p>
                                </div>
                                <div className="flex items-center text-green-500">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    <span>Active</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="space-y-1">
                                    <p className="font-medium">Dependency Scan (SCA)</p>
                                    <p className="text-sm text-muted-foreground">Snyk • Blocking High+</p>
                                </div>
                                <div className="flex items-center text-green-500">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    <span>Active</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="space-y-1">
                                    <p className="font-medium">Container Scan</p>
                                    <p className="text-sm text-muted-foreground">Trivy • Non-Blocking</p>
                                </div>
                                <div className="flex items-center text-yellow-500">
                                    <Clock className="w-5 h-5 mr-2" />
                                    <span>Warning Only</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">Dynamic Analysis (DAST)</p>
                                    <p className="text-sm text-muted-foreground">OWASP ZAP • Weekly Scan</p>
                                </div>
                                <div className="flex items-center text-green-500">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    <span>Scheduled</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
