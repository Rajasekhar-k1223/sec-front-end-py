import { useState, useEffect } from 'react';
import TenantTable, { type Tenant } from '@/components/tenants/TenantTable';
import TenantModal from '@/components/tenants/TenantModal';
import { Button } from '@/components/ui/button';
import { Plus, Users, Building, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/auth';
import { tenantsService } from '@/lib/api';

export default function TenantsManagement() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tenants, setTenants] = useState<Tenant[]>([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTenant, setCurrentTenant] = useState<Tenant | undefined>(undefined);

    const fetchTenants = async () => {
        try {
            const response = await tenantsService.getTenants();
            if (response.data) {
                // Map to camelCase
                const mappedData = response.data.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    status: t.status || 'active',
                    agentCount: t.agent_count || 0,
                    agentLimit: t.agent_limit || 10,
                    plan: t.plan_id || 'Starter',
                    createdAt: t.created_at ? new Date(t.created_at).toISOString().split('T')[0] : 'N/A'
                }));
                setTenants(mappedData);
            }
        } catch (error) {
            console.error("Failed to fetch tenants:", error);
            // alert("Failed to fetch tenants. Please check console.");
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const handleCreateTenant = () => {
        setCurrentTenant(undefined);
        setIsModalOpen(true);
    };

    const handleEditTenant = (tenant: Tenant) => {
        setCurrentTenant(tenant);
        setIsModalOpen(true);
    };

    const handleSaveTenant = async () => {
        await fetchTenants(); // Refresh list
        setIsModalOpen(false);
    };

    const handleDeleteTenant = async (tenant: Tenant) => {
        if (confirm(`Are you sure you want to delete ${tenant.name}? This action cannot be undone.`)) {
            try {
                await tenantsService.deleteTenant(tenant.id);
                setTenants(prev => prev.filter(t => t.id !== tenant.id));
            } catch (error) {
                console.error("Failed to delete tenant:", error);
                alert("Failed to delete tenant");
            }
        }
    };

    const handleSuspendTenant = async (tenant: Tenant) => {
        const newStatus = tenant.status === 'suspended' ? 'active' : 'suspended';
        const action = tenant.status === 'suspended' ? 'Activate' : 'Suspend';

        if (confirm(`Are you sure you want to ${action} ${tenant.name}?`)) {
            try {
                await tenantsService.updateTenant(tenant.id, {
                    is_active: newStatus === 'active',
                    status: newStatus
                });

                // Update local state immediately for better UX
                setTenants(prev => prev.map(t =>
                    t.id === tenant.id ? { ...t, status: newStatus } : t
                ));
            } catch (error) {
                console.error(`Failed to ${action} tenant:`, error);
                alert(`Failed to ${action} tenant`);
            }
        }
    };

    const handleViewAgents = (tenant: Tenant) => {
        // Navigate or show modal
        // For now, let's navigate to agents page with filter
        // We need to implement query param filtering on Agents page first.
        // Assuming we have it or will add it:
        navigate(`/agents?tenant_id=${tenant.id}`);
    };

    const handleImpersonate = async (tenant: Tenant) => {
        if (!confirm(`Are you sure you want to login as ${tenant.name}?`)) return;

        try {
            const response = await authService.impersonate(tenant.id);
            localStorage.setItem('token', response.access_token);
            // hard reload to reset all states
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Failed to impersonate:", error);
            alert("Failed to login as tenant. Please check if the tenant has an admin user.");
        }
    };

    const filteredTenants = tenants.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="h-full flex flex-col space-y-4 p-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Tenants Management</h2>
                    <p className="text-muted-foreground">Manage customer environments, quotas, and subscriptions.</p>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={handleCreateTenant}><Plus className="mr-2 h-4 w-4" /> Create Tenant</Button>
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
                        <div className="text-2xl font-bold">{tenants.reduce((acc, t) => acc + (t.agentCount || 0), 0)}</div>
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

            <div className="flex-1 overflow-y-auto border rounded-md" style={{ maxHeight: '600px' }}>
                <TenantTable
                    tenants={filteredTenants}
                    onEdit={handleEditTenant}
                    onDelete={handleDeleteTenant}
                    onSuspend={handleSuspendTenant}
                    onViewAgents={handleViewAgents}
                    onImpersonate={handleImpersonate}
                />
            </div>

            <TenantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTenant}
                tenant={currentTenant}
            />
        </div>
    );
}
