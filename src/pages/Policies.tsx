import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Policy As Code</h2>
                    <p className="text-muted-foreground">Manage OPA and Kyverno policies.</p>
                </div>
                <div className="flex space-x-2">
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
