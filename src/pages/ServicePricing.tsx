import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Plus } from 'lucide-react';
import { pricingService } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function ServicePricing() {
    const [plans, setPlans] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [newPlan, setNewPlan] = useState({ name: '', price: '', features: ['Standard Support'] });

    const fetchPlans = async () => {
        try {
            const response = await pricingService.getPlans();
            setPlans(response.data);
        } catch (error) {
            console.error("Failed", error);
        }
    };

    const handleCreate = async () => {
        try {
            await pricingService.createPlan({
                id: crypto.randomUUID(),
                ...newPlan,
                popular: false,
                period: '/mo',
                description: 'Custom Plan'
            });
            setOpen(false);
            fetchPlans();
            setNewPlan({ name: '', price: '', features: ['Standard Support'] });
        } catch (error) {
            console.error("Failed to create plan", error);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const rates = [
        { item: 'Additional vCPU', unit: 'Core/Hour', price: '$0.045' },
        { item: 'Object Storage (S3)', unit: 'GB/Month', price: '$0.023' },
        { item: 'Egress Bandwidth', unit: 'GB', price: '$0.01' },
        { item: 'Load Balancer', unit: 'Hour', price: '$0.025' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Internal Service Pricing</h2>
                    <p className="text-muted-foreground mt-2">Transparent chargeback models for platform resources.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> New Plan</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Pricing Plan</DialogTitle>
                            <DialogDescription>Define a new service tier.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price</Label>
                                <Input id="price" value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate}>Create Plan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.name} className="flex flex-col border-2 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-extrabold">{plan.price}</span>
                                <span className="text-muted-foreground ml-1">{plan.period}</span>
                            </div>
                            <ul className="space-y-3">
                                {plan.features.map((feature: string) => (
                                    <li key={feature} className="flex items-center text-sm">
                                        <Check className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Select Plan</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>A La Carte Resource Rates</CardTitle>
                    <CardDescription>Pay-as-you-go pricing for additional capacity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted font-medium">
                                <tr>
                                    <th className="p-3">Resource Type</th>
                                    <th className="p-3">Unit</th>
                                    <th className="p-3 text-right">Internal Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rates.map((rate, i) => (
                                    <tr key={i} className="border-t hover:bg-muted/10">
                                        <td className="p-3 font-medium">{rate.item}</td>
                                        <td className="p-3 text-muted-foreground">{rate.unit}</td>
                                        <td className="p-3 text-right font-mono">{rate.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
