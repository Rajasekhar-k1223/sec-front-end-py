import { useState, useEffect } from 'react';
import TenantTable, { type Tenant } from '@/components/tenants/TenantTable';
import { Button } from '@/components/ui/button';
import { Plus, Users, Building, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { tenantsService } from '@/lib/api';

export default function TenantsManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tenants, setTenants] = useState<Tenant[]>([]);

    useEffect(() => {
        const mockTenants: Tenant[] = [
            { id: '1', name: 'Acme Corp', status: 'active', agentCount: 154, agentLimit: 200, plan: 'Enterprise', createdAt: '2023-01-15' },
            { id: '2', name: 'Globex Inc.', status: 'active', agentCount: 45, agentLimit: 50, plan: 'Business', createdAt: '2023-03-22' },
            { id: '3', name: 'Soylent Corp', status: 'suspended', agentCount: 0, agentLimit: 100, plan: 'Business', createdAt: '2023-02-10' },
            { id: '4', name: 'Initech', status: 'active', agentCount: 220, agentLimit: 500, plan: 'Unlimited', createdAt: '2022-11-05' },
            { id: '5', name: 'Massive Dynamic', status: 'trial', agentCount: 5, agentLimit: 10, plan: 'Free', createdAt: '2023-11-01' },
            { id: '6', name: 'Cyberdyne Systems', status: 'active', agentCount: 850, agentLimit: 1000, plan: 'Enterprise', createdAt: '2022-08-30' },
        ];

        const fetchTenants = async () => {
            try {
                const response = await tenantsService.getTenants();
                if (response.data && response.data.length > 0) {
                    // Map snake_case to camelCase
                    const mappedData = response.data.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        status: t.status,
                        agentCount: t.agent_count,
                        agentLimit: t.agent_limit,
                        plan: t.plan,
                        createdAt: t.created_at
                    }));
                    setTenants(mappedData);
                } else {
                    setTenants(mockTenants);
                }
            } catch (error) {
                console.warn("Using mock tenants:", error);
                setTenants(mockTenants);
            }
        };
        fetchTenants();
    }, []);

    const filteredTenants = tenants.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Tenants Management</h2>
                    <p className="text-muted-foreground">Manage customer environments, quotas, and subscriptions.</p>
                </div>
                <div className="flex space-x-2">
                    <Button><Plus className="mr-2 h-4 w-4" /> Create Tenant</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tenants.length}</div>
                        <p className="text-xs text-muted-foreground">+2 this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,007</div>
                        <p className="text-xs text-muted-foreground">Across all tenants</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450</div>
                        <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center space-x-2">
                <Input
                    className="w-[300px]"
                    placeholder="Search tenants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-hidden border rounded-md">
                <TenantTable tenants={filteredTenants} />
            </div>
        </div>
    );
}
