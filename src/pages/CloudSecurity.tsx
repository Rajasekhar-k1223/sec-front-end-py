import { useState, useEffect } from 'react';
import ComplianceChart from '@/components/cspm/ComplianceChart';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Plus, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { cloudService } from '@/lib/api';

export default function CloudSecurity() {
    const [stats, setStats] = useState({
        active_connectors: 0,
        resources_scanned: 0,
        passed_checks: 0,
        critical_issues: 0
    });
    const [complianceData, setComplianceData] = useState<any[]>([]);
    const [misconfigurations, setMisconfigurations] = useState<any[]>([]);

    useEffect(() => {
        const mockStats = {
            active_connectors: 3,
            resources_scanned: 1250,
            passed_checks: 1180,
            critical_issues: 5
        };
        const mockCompliance = [
            { name: 'AWS CIS', score: 85 },
            { name: 'PCI-DSS', score: 92 },
            { name: 'HIPAA', score: 100 },
        ];
        const mockMisconfigs = [
            { check: 'S3 Bucket Publicly Accessible', resource: 'aws:s3:finance-logs', severity: 'Critical' },
            { check: 'Security Group Port 22 Open', resource: 'aws:ec2:ssh-bastion', severity: 'High' },
            { check: 'Root Account MFA Missing', resource: 'aws:iam:root', severity: 'Critical' },
            { check: 'RDS Snapshot Public', resource: 'aws:rds:customer-db', severity: 'High' },
            { check: 'EBS Volume Unencrypted', resource: 'aws:ebs:vol-0492', severity: 'Medium' },
        ];

        const fetchStats = async () => {
            try {
                const response = await cloudService.getStats();
                if (response.data && response.data.stats) {
                    setStats(response.data.stats);
                    setComplianceData(response.data.compliance);
                    setMisconfigurations(response.data.misconfigurations);
                } else {
                    // Fallback
                    setStats(mockStats);
                    setComplianceData(mockCompliance);
                    setMisconfigurations(mockMisconfigs);
                }
            } catch (error) {
                console.warn("Using mock cloud stats:", error);
                setStats(mockStats);
                setComplianceData(mockCompliance);
                setMisconfigurations(mockMisconfigs);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Cloud Security Posture</h2>
                    <p className="text-muted-foreground">Monitor AWS, Azure, and GCP for misconfigurations and compliance.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Cloud className="mr-2 h-4 w-4" /> Manage Connectors</Button>
                    <Button><Plus className="mr-2 h-4 w-4" /> Add Account</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Connectors</CardTitle>
                        <Cloud className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active_connectors}</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resources Scanned</CardTitle>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resources_scanned.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across 3 regions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Passed Checks</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.passed_checks}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.resources_scanned > 0 ? Math.round((stats.passed_checks / stats.resources_scanned) * 100) : 0}% Compliance Rate
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.critical_issues}</div>
                        <p className="text-xs text-muted-foreground">Action Needed</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-3">
                    <ComplianceChart data={complianceData} />
                </div>
                <div className="col-span-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Top Misconfigurations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {misconfigurations.map((issue, i) => (
                                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{issue.check}</p>
                                            <p className="text-xs text-muted-foreground">{issue.resource}</p>
                                        </div>
                                        <Badge
                                            variant={issue.severity === 'Critical' ? 'destructive' : issue.severity === 'High' ? 'destructive' : 'default'}
                                            className={issue.severity === 'High' ? 'bg-orange-500' : issue.severity === 'Medium' ? 'bg-yellow-500 text-black' : ''}
                                        >
                                            {issue.severity.toUpperCase()}
                                        </Badge>
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
