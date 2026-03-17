import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Tenant } from './TenantTable';
import { tenantsService } from '@/lib/api';

interface TenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    tenant?: Tenant; // If provided, we are editing. If undefined, creating.
}

export default function TenantModal({ isOpen, onClose, onSave, tenant }: TenantModalProps) {
    const [name, setName] = useState('');
    const [plan, setPlan] = useState('free');
    const [agentLimit, setAgentLimit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const PLAN_LIMITS: Record<string, number> = {
        'free': 10,
        'starter': 50,
        'business': 250,
        'enterprise': 1000,
        'unlimited': 9999
    };

    useEffect(() => {
        if (tenant) {
            setName(tenant.name);
            setPlan(tenant.plan?.toLowerCase() || 'free');
            setAgentLimit(tenant.agentLimit);
        } else {
            setName('');
            setPlan('free');
            setAgentLimit(10);
        }
    }, [tenant, isOpen]);

    // Update limit when plan changes, but only if we are creating OR if we want to enforce it on edit logic too.
    // The user request implies strict enforcement: "based on the plan selection agents limit is need show its not editable"
    useEffect(() => {
        const limit = PLAN_LIMITS[plan] || 10;
        setAgentLimit(limit);
    }, [plan]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = {
                name,
                plan_id: plan,
                agent_limit: agentLimit
            };

            if (tenant) {
                await tenantsService.updateTenant(tenant.id, data);
            } else {
                await tenantsService.createTenant(data);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to save tenant:", error);
            alert("Failed to save tenant. Please check network tab for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{tenant ? 'Edit Tenant' : 'Create Tenant'}</DialogTitle>
                    <DialogDescription>
                        {tenant ? 'Update tenant details and quotas.' : 'Add a new tenant environment.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plan" className="text-right">
                                Plan
                            </Label>
                            <Select value={plan} onValueChange={setPlan}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">Free Tier (10 Agents)</SelectItem>
                                    <SelectItem value="starter">Starter (50 Agents)</SelectItem>
                                    <SelectItem value="business">Business (250 Agents)</SelectItem>
                                    <SelectItem value="enterprise">Enterprise (1000 Agents)</SelectItem>
                                    <SelectItem value="unlimited">Unlimited</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="limit" className="text-right">
                                Agent Limit
                            </Label>
                            <Input
                                id="limit"
                                type="number"
                                value={agentLimit}
                                readOnly
                                disabled
                                className="col-span-3 bg-muted text-muted-foreground"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
