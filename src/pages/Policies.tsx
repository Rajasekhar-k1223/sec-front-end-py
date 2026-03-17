import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, FileCode, CheckCircle, AlertCircle } from 'lucide-react';
import { policiesService } from '@/lib/api';

interface Policy {
    id: string;
    name: string;
    type: string;
    enforcement: string;
    description: string;
}

export default function Policies() {
    const [policies, setPolicies] = useState<Policy[]>([]);

    useEffect(() => {
        const mockPolicies: Policy[] = [
            { id: '1', name: 'require-resource-tags', type: 'OPA', enforcement: 'active', description: 'All resources must have "CostCenter" and "Owner" tags.' },
            { id: '2', name: 'deny-public-s3-buckets', type: 'Terraform', enforcement: 'active', description: 'Prevents creation of S3 buckets with public ACLs.' },
            { id: '3', name: 'restrict-iam-admin-access', type: 'OPA', enforcement: 'audit', description: 'Flag usage of "*" in IAM Allow policies.' },
            { id: '4', name: 'enforce-tls-everywhere', type: 'Kyverno', enforcement: 'active', description: 'Ingress resources must use TLS 1.2+.' },
            { id: '5', name: 'limit-container-privileges', type: 'Kyverno', enforcement: 'audit', description: 'Pods should not run as root.' },
        ];

        const fetchPolicies = async () => {
            try {
                const response = await policiesService.getPolicies();
                if (response.data && response.data.length > 0) {
                    setPolicies(response.data);
                } else {
                    setPolicies(mockPolicies);
                }
            } catch (error) {
                console.warn("Using mock policies:", error);
                setPolicies(mockPolicies);
            }
        };
        fetchPolicies();
    }, []);

    const [showGenModal, setShowGenModal] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [generatedPolicy, setGeneratedPolicy] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await policiesService.generatePolicy(prompt);
            setGeneratedPolicy(res.data);
        } catch (error) {
            console.error("Failed to generate", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {showGenModal && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="mr-2 h-5 w-5 text-primary" />
                                AI Policy Generator
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Describe your security requirement in plain English.</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!generatedPolicy ? (
                                <>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="e.g., Block port 80 for all apps, or Disallow root user in containers"
                                        value={prompt}
                                        onChange={e => setPrompt(e.target.value)}
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="outline" onClick={() => setShowGenModal(false)}>Cancel</Button>
                                        <Button onClick={handleGenerate} disabled={isGenerating}>
                                            {isGenerating ? 'Generating...' : 'Generate Policy'}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">Generated {generatedPolicy.type} Policy</span>
                                        <Badge>{generatedPolicy.name}</Badge>
                                    </div>
                                    <pre className="bg-secondary/50 p-4 rounded-md text-xs font-mono overflow-auto max-h-[300px]">
                                        {generatedPolicy.content}
                                    </pre>
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="outline" onClick={() => setGeneratedPolicy(null)}>Back</Button>
                                        <Button onClick={() => setShowGenModal(false)}>Use Template</Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Policy As Code</h2>
                    <p className="text-muted-foreground">Manage OPA and Kyverno policies.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setShowGenModal(true)}>
                        <Shield className="mr-2 h-4 w-4" /> Generate with AI
                    </Button>
                    <Button>+ New Policy</Button>
                </div>
            </div>

            <div className="rounded-md border border-border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                    <div className="col-span-4">Policy Name</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Enforcement</div>
                    <div className="col-span-4">Description</div>
                </div>

                {policies.map((pol) => (
                    <div key={pol.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors">
                        <div className="col-span-4 font-medium flex items-center space-x-2">
                            <FileCode className="h-4 w-4 text-primary" />
                            <span>{pol.name}</span>
                        </div>
                        <div className="col-span-2 uppercase text-xs font-bold text-muted-foreground">{pol.type}</div>
                        <div className="col-span-2">
                            <Badge variant={pol.enforcement === 'active' ? 'default' : 'secondary'}>
                                {pol.enforcement}
                            </Badge>
                        </div>
                        <div className="col-span-4 text-muted-foreground truncate" title={pol.description}>{pol.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
