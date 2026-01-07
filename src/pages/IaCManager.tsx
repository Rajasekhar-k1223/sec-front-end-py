import { useState, useEffect } from 'react';
import { iacService } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, Cloud, Terminal, CheckCircle, XCircle, Play, Box, Server, Database, Network, Lock, Wifi, Plus, Key } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface IacStack {
    id: string;
    name: string;
    tool: 'Terraform' | 'Pulumi';
    cloud: 'AWS' | 'Azure' | 'GCP';
    status: 'Applied' | 'Failed' | 'Drifted' | 'Planning';
    lastRun: string;
    resources: number;
    region: string;
}

interface IacRun {
    id: string;
    stack: string;
    action: 'Apply' | 'Plan' | 'Destroy' | 'Preview';
    status: 'Success' | 'Failed';
    initiator: string;
    time: string;
}

interface CloudFeature {
    id: string;
    category: string;
    name: string;
    managedBy: 'Terraform' | 'Pulumi';
    status: 'Synced' | 'Pending';
}

export default function IaCManager() {
    const [selectedCloud, setSelectedCloud] = useState<'All' | 'AWS' | 'Azure' | 'GCP'>('All');
    const [stacks, setStacks] = useState<IacStack[]>([]);
    const [runs, setRuns] = useState<IacRun[]>([]);
    const [features, setFeatures] = useState<CloudFeature[]>([]);
    const [connectType, setConnectType] = useState<'AWS' | 'Azure' | 'GCP'>('AWS');
    const [isConnectOpen, setIsConnectOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await iacService.getStacks();
                setStacks(response.data);
            } catch (error) {
                console.error("Failed to fetch IaC stacks, using fallback", error);
                // Fallback Mock Data
                setStacks([
                    { id: '1', name: 'prod-vpc-network', tool: 'Terraform', cloud: 'AWS', status: 'Applied', lastRun: '2 hours ago', resources: 45, region: 'us-east-1' },
                    { id: '2', name: 'k8s-cluster-gke', tool: 'Pulumi', cloud: 'GCP', status: 'Applied', lastRun: '5 hours ago', resources: 12, region: 'us-central1' },
                    { id: '3', name: 'azure-functions-app', tool: 'Terraform', cloud: 'Azure', status: 'Drifted', lastRun: '1 day ago', resources: 8, region: 'eastus' },
                    { id: '4', name: 'analytics-pipeline', tool: 'Pulumi', cloud: 'AWS', status: 'Planning', lastRun: 'Just now', resources: 22, region: 'eu-west-1' },
                    { id: '5', name: 'bigquery-datasets', tool: 'Terraform', cloud: 'GCP', status: 'Applied', lastRun: '3 days ago', resources: 5, region: 'multi' },
                ]);
            }
        };
        fetchData();

        setRuns([
            { id: '101', stack: 'prod-vpc-network', action: 'Apply', status: 'Success', initiator: 'CI/CD', time: '2h ago' },
            { id: '102', stack: 'azure-functions-app', action: 'Plan', status: 'Failed', initiator: 'dev-user', time: '1d ago' },
            { id: '103', stack: 'k8s-cluster-gke', action: 'Preview', status: 'Success', initiator: 'Pulumi Cloud', time: '5h ago' },
        ]);

        setFeatures([
            // AWS
            { id: 'aws-1', category: 'Compute', name: 'EC2 Auto Scaling Groups', managedBy: 'Terraform', Status: 'Synced' },
            { id: 'aws-2', category: 'Database', name: 'RDS Aurora (Postgres)', managedBy: 'Pulumi', Status: 'Synced' },
            { id: 'aws-3', category: 'Network', name: 'Transit Gateway', managedBy: 'Terraform', Status: 'Synced' },
            // Azure
            { id: 'az-1', category: 'Compute', name: 'AKS (Kubernetes)', managedBy: 'Terraform', Status: 'Synced' },
            { id: 'az-2', category: 'Storage', name: 'Azure Blob Storage', managedBy: 'Terraform', Status: 'Pending' },
            { id: 'az-3', category: 'Serverless', name: 'Azure Functions', managedBy: 'Terraform', Status: 'Synced' },
            // GCP
            { id: 'gcp-1', category: 'Compute', name: 'GKE Standard Cluster', managedBy: 'Pulumi', Status: 'Synced' },
            { id: 'gcp-2', category: 'AI/ML', name: 'Vertex AI Workbench', managedBy: 'Terraform', Status: 'Synced' },
            { id: 'gcp-3', category: 'Data', name: 'BigQuery Datasets', managedBy: 'Terraform', Status: 'Synced' },
        ] as any);
    }, []);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            // Mock connection data
            await iacService.connectCloud({ provider: connectType, credentials: { active: true } });
            setIsConnectOpen(false);
            // Optionally refresh stacks
        } catch (error) {
            console.error("Connection failed", error);
        } finally {
            setIsConnecting(false);
        }
    };

    const filteredStacks = selectedCloud === 'All' ? stacks : stacks.filter(s => s.cloud === selectedCloud);
    const filteredFeatures = selectedCloud === 'All' ? features : features.filter(f => {
        if (selectedCloud === 'AWS') return f.id.startsWith('aws');
        if (selectedCloud === 'Azure') return f.id.startsWith('az');
        if (selectedCloud === 'GCP') return f.id.startsWith('gcp');
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Applied': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Success': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Synced': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Drifted': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Pending': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Infrastructure as Code</h2>
                    <p className="text-muted-foreground">Manage Multi-Cloud infrastructure with Terraform and Pulumi.</p>
                </div>
                <div className="flex space-x-2">
                    <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default">
                                <Key className="mr-2 h-4 w-4" /> Connect Cloud
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Connect Cloud Platform</DialogTitle>
                                <DialogDescription>
                                    Add your cloud provider credentials to enable IaC management.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="provider" className="text-right">
                                        Provider
                                    </Label>
                                    <Select
                                        value={connectType}
                                        onValueChange={(val: any) => setConnectType(val)}
                                    >
                                        <SelectTrigger className="w-[280px]">
                                            <SelectValue placeholder="Select Provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AWS">Amazon Web Services (AWS)</SelectItem>
                                            <SelectItem value="Azure">Microsoft Azure</SelectItem>
                                            <SelectItem value="GCP">Google Cloud Platform</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {connectType === 'AWS' && (
                                    <>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="aws-access" className="text-right">Access Key</Label>
                                            <Input id="aws-access" placeholder="AKIA..." className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="aws-secret" className="text-right">Secret Key</Label>
                                            <Input id="aws-secret" type="password" placeholder="wJalr..." className="col-span-3" />
                                        </div>
                                        <div className="bg-secondary/20 p-3 rounded-md text-xs text-muted-foreground">
                                            <p className="font-semibold mb-1">How it works:</p>
                                            We recommend creating a specific IAM User with <code>AdministratorAccess</code> or specific Terraform/Pulumi policies.
                                        </div>
                                    </>
                                )}

                                {connectType === 'Azure' && (
                                    <>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="az-tenant" className="text-right">Tenant ID</Label>
                                            <Input id="az-tenant" placeholder="00000000-0000..." className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="az-client" className="text-right">Client ID</Label>
                                            <Input id="az-client" placeholder="00000000-0000..." className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="az-secret" className="text-right">Client Secret</Label>
                                            <Input id="az-secret" type="password" className="col-span-3" />
                                        </div>
                                        <div className="bg-secondary/20 p-3 rounded-md text-xs text-muted-foreground">
                                            <p className="font-semibold mb-1">How it works:</p>
                                            Create a <strong>Service Principal</strong> in Azure AD and assign it <code>Contributor</code> role on your Subscription.
                                        </div>
                                    </>
                                )}

                                {connectType === 'GCP' && (
                                    <>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="gcp-project" className="text-right">Project ID</Label>
                                            <Input id="gcp-project" placeholder="my-project-id" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="gcp-sa" className="text-right">Service Account Key (JSON)</Label>
                                            <Input id="gcp-sa" type="file" className="col-span-3" />
                                        </div>
                                        <div className="bg-secondary/20 p-3 rounded-md text-xs text-muted-foreground">
                                            <p className="font-semibold mb-1">How it works:</p>
                                            Create a Service Account in IAM, download the JSON key, and assign <code>Editor</code> or specific roles.
                                        </div>
                                    </>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleConnect} disabled={isConnecting}>
                                    {isConnecting ? 'Connecting...' : 'Save Connection'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="text-muted-foreground">
                        <Terminal className="mr-2 h-4 w-4" /> Sync All
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Stack
                    </Button>
                </div>
            </div>

            {/* Cloud Provider Filter */}
            <div className="flex items-center space-x-2 pb-2">
                {(['All', 'AWS', 'Azure', 'GCP'] as const).map((cloud) => (
                    <Button
                        key={cloud}
                        variant={selectedCloud === cloud ? "default" : "outline"}
                        onClick={() => setSelectedCloud(cloud)}
                        className="w-24 border-dashed border-border"
                    >
                        {cloud}
                    </Button>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className={selectedCloud === 'AWS' || selectedCloud === 'All' ? "border-amber-500/20" : "opacity-50"}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AWS Environment</CardTitle>
                        <Cloud className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium">Connected</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Account: 1234-5678-9012</p>
                    </CardContent>
                </Card>
                <Card className={selectedCloud === 'Azure' || selectedCloud === 'All' ? "border-blue-500/20" : "opacity-50"}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Azure Tenant</CardTitle>
                        <Cloud className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium">Connected</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Tenant: contoso-corp-01</p>
                    </CardContent>
                </Card>
                <Card className={selectedCloud === 'GCP' || selectedCloud === 'All' ? "border-red-500/20" : "opacity-50"}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">GCP Project</CardTitle>
                        <Cloud className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium">Connected</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Project: acme-prod-x99</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Stack List */}
                <div className="md:col-span-2 space-y-6">
                    <Tabs defaultValue="all" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="all">Active Stacks</TabsTrigger>
                            <TabsTrigger value="terraform">Terraform</TabsTrigger>
                            <TabsTrigger value="pulumi">Pulumi</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Infrastructure Stacks ({selectedCloud})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {filteredStacks.map((stack) => (
                                            <div key={stack.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-2 rounded-md ${stack.tool === 'Terraform' ? 'bg-purple-500/10' : 'bg-orange-500/10'}`}>
                                                        {stack.tool === 'Terraform' ? <Box className={`h-5 w-5 ${stack.tool === 'Terraform' ? 'text-purple-500' : 'text-orange-500'}`} /> : <Terminal className={`h-5 w-5 ${stack.tool === 'Terraform' ? 'text-purple-500' : 'text-orange-500'}`} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{stack.name}</h4>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Badge variant="outline" className="text-[10px]">{stack.cloud}</Badge>
                                                            <Badge variant="secondary" className="text-[10px]">{stack.region}</Badge>
                                                            <span>• {stack.resources} Res</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge className={getStatusColor(stack.status)} variant="outline">
                                                        {stack.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm"><Play className="h-4 w-4" /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="terraform">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Box className="h-5 w-5 text-purple-500" />
                                        Terraform State
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-secondary/30 rounded-lg border border-purple-500/20">
                                        <h4 className="font-semibold text-purple-400 mb-2">backend "s3" (Locked)</h4>
                                        <p className="text-sm text-muted-foreground mb-4">State file <code>terraform.tfstate</code> is currently locked by <strong>ci-runner-01</strong>.</p>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="destructive">Force Unlock</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="pulumi">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Terminal className="h-5 w-5 text-orange-500" />
                                        Pulumi Graph
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-40 bg-secondary/20 rounded-lg flex items-center justify-center border border-dashed border-orange-500/20">
                                        <p className="text-xs text-muted-foreground">Visualizing dependency graph...</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Platform Features Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Platform Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {filteredFeatures.map((feat) => (
                                    <div key={feat.id} className="p-3 border rounded-md bg-secondary/10 hover:bg-secondary/20 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-sm">{feat.name}</span>
                                            {/* @ts-ignore */}
                                            <Badge variant="outline" className="text-[10px]">{feat.Status}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{feat.category}</span>
                                            <span className={feat.managedBy === 'Terraform' ? 'text-purple-500' : 'text-orange-500'}>
                                                {feat.managedBy}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {runs.map((run) => (
                                    <div key={run.id} className="flex items-start gap-3 text-sm">
                                        {run.status === 'Success' ? <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" /> : <XCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                                        <div className="flex-1">
                                            <p className="font-medium">{run.stack}</p>
                                            <p className="text-xs text-muted-foreground">{run.action} • {run.time}</p>
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

