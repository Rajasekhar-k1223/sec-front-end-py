import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ShieldAlert } from 'lucide-react';
import { patchingService } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface Patch {
    id: string;
    cve_id: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    affected_assets: number;
    status: 'pending_approval' | 'scheduled' | 'applied';
    publish_date: string;
}

export default function Patching() {
    const [patches, setPatches] = useState<Patch[]>([]);

    useEffect(() => {
        const mockPatches: Patch[] = [
            { id: '1', cve_id: 'CVE-2023-4863', description: 'Heap buffer overflow in WebP', severity: 'critical', affected_assets: 150, status: 'pending_approval', publish_date: '2023-09-12' },
            { id: '2', cve_id: 'CVE-2023-44487', description: 'HTTP/2 Rapid Reset Attack', severity: 'high', affected_assets: 45, status: 'scheduled', publish_date: '2023-10-10' },
            { id: '3', cve_id: 'KB5031356', description: 'Cumulative Update for Windows Server 2022', severity: 'medium', affected_assets: 80, status: 'applied', publish_date: '2023-10-10' },
            { id: '4', cve_id: 'USN-6421-1', description: 'Ubuntu Linux Kernel Vulnerabilities', severity: 'high', affected_assets: 20, status: 'pending_approval', publish_date: '2023-10-11' },
            { id: '5', cve_id: 'CVE-2023-38545', description: 'curl heap buffer overflow', severity: 'high', affected_assets: 300, status: 'scheduled', publish_date: '2023-10-11' },
        ];

        const fetchPatches = async () => {
            try {
                const response = await patchingService.getPatches();
                if (response.data && response.data.length > 0) {
                    setPatches(response.data);
                } else {
                    setPatches(mockPatches);
                }
            } catch (error) {
                console.warn("Using mock patches:", error);
                setPatches(mockPatches);
            }
        };
        fetchPatches();
    }, []);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Patch Management</h2>
                    <p className="text-muted-foreground">Vulnerability remediation and update scheduling.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Scan Now</Button>
                    <Button>Approvals</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Patches</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{patches.filter(p => p.severity === 'critical').length}</div>
                        <p className="text-xs text-muted-foreground">Pending installation</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border border-border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                    <div className="col-span-2">CVE ID</div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-2">Severity</div>
                    <div className="col-span-2">Affected Assets</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>

                {patches.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">Loading patches...</div>
                ) : (
                    patches.map((patch) => (
                        <div key={patch.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors">
                            <div className="col-span-2 font-mono text-xs">{patch.cve_id}</div>
                            <div className="col-span-4 text-muted-foreground">{patch.description}</div>
                            <div className="col-span-2">
                                <span className={`text-xs px-2 py-1 rounded border capitalize ${getSeverityColor(patch.severity)}`}>
                                    {patch.severity}
                                </span>
                            </div>
                            <div className="col-span-2 text-muted-foreground">{patch.affected_assets} Hosts</div>
                            <div className="col-span-2 text-right">
                                <Badge variant="outline" className="capitalize">
                                    {patch.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
