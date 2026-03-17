import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Plus, ShieldCheck, Wallet } from 'lucide-react';
import { finOpsService, billingService } from '@/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CostItem {
    service: string;
    amount: number;
    currency: string;
    trend: string;
    [key: string]: any;
}

interface PaymentMethod {
    id: string;
    type: string;
    brand: string;
    last4: string;
    expiry_month: number;
    expiry_year: number;
    is_default: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function FinOpsBilling() {
    const [costs, setCosts] = useState<CostItem[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [newCard, setNewCard] = useState({
        brand: 'Visa',
        last4: '',
        expiry_month: 12,
        expiry_year: 2028,
        type: 'card'
    });

    const fetchData = async () => {
        try {
            const [costRes, pmRes] = await Promise.all([
                finOpsService.getCosts(),
                billingService.getPaymentMethods()
            ]);
            setCosts(costRes.data.length > 0 ? costRes.data : [
                { service: 'Cloud Infrastructure', amount: 450, currency: 'USD', trend: 'up' },
                { service: 'Endpoint Security', amount: 120, currency: 'USD', trend: 'flat' },
                { service: 'Network Bandwidth', amount: 45, currency: 'USD', trend: 'down' }
            ]);
            setPaymentMethods(pmRes.data);
        } catch (error) {
            console.error("Error fetching billing data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCard = async () => {
        if (!newCard.last4 || newCard.last4.length !== 4) {
            alert("Please enter last 4 digits.");
            return;
        }
        try {
            await billingService.addPaymentMethod(newCard);
            setIsAddCardOpen(false);
            fetchData();
            alert("Payment method added successfully.");
        } catch (error) {
            alert("Failed to add payment method.");
        }
    };

    const totalCost = costs.reduce((acc, item) => acc + item.amount, 0);

    return (
        <div className="space-y-6 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">FinOps & Billing</h2>
                    <p className="text-muted-foreground">Manage your cloud spend, subscriptions, and payment methods.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Wallet className="h-4 w-4" /> Download Invoices
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Unbilled</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-red-500" /> +12% from last cycle
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Enterprise</div>
                        <p className="text-xs text-muted-foreground">Renews on Feb 15, 2026</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Spending by Category</CardTitle>
                        <CardDescription>Visual breakdown of current period resource usage.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={costs}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="amount"
                                    nameKey="service"
                                >
                                    {costs.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Payment Methods</CardTitle>
                            <CardDescription>Default card for renewals.</CardDescription>
                        </div>
                        <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Payment Method</DialogTitle>
                                    <DialogDescription>Attach a new card to your tenant account.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Brand</Label>
                                        <select
                                            className="col-span-3 h-10 border rounded px-2"
                                            value={newCard.brand}
                                            onChange={(e) => setNewCard({ ...newCard, brand: e.target.value })}
                                        >
                                            <option>Visa</option>
                                            <option>Mastercard</option>
                                            <option>Amex</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Last 4 Digits</Label>
                                        <Input
                                            maxLength={4}
                                            placeholder="4242"
                                            className="col-span-3"
                                            value={newCard.last4}
                                            onChange={(e) => setNewCard({ ...newCard, last4: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Expiry</Label>
                                        <div className="col-span-3 flex gap-2">
                                            <Input placeholder="MM" value={newCard.expiry_month} onChange={(e) => setNewCard({ ...newCard, expiry_month: parseInt(e.target.value) })} />
                                            <Input placeholder="YYYY" value={newCard.expiry_year} onChange={(e) => setNewCard({ ...newCard, expiry_year: parseInt(e.target.value) })} />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddCard}>Save Card</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {paymentMethods.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground italic text-sm">
                                    No payment methods found.
                                </div>
                            ) : (
                                paymentMethods.map((pm) => (
                                    <div key={pm.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                                                <CreditCard className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm capitalize">{pm.brand} •••• {pm.last4}</div>
                                                <div className="text-xs text-muted-foreground font-mono">Expires {pm.expiry_month}/{pm.expiry_year}</div>
                                            </div>
                                        </div>
                                        {pm.is_default && <Badge variant="secondary" className="text-[10px] h-5">DEFAULT</Badge>}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <p className="text-[10px] text-muted-foreground text-center w-full">
                            Billing is processed by our secure platform partner.
                        </p>
                    </CardFooter>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Cost Breakdown</CardTitle>
                    <CardDescription>Granular view of all billed services for the current tenant.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {costs.map((item) => (
                            <div key={item.service} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <div className="font-medium">{item.service}</div>
                                    <div className="text-xs text-muted-foreground uppercase">Provisioned Resource</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="font-mono font-bold">${item.amount.toLocaleString()}</div>
                                        <div className="text-[10px] text-muted-foreground">Est. for full period</div>
                                    </div>
                                    <div className="w-12 flex justify-center">
                                        {item.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                                        {item.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                                        {item.trend === 'flat' && <span className="text-muted-foreground">-</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
