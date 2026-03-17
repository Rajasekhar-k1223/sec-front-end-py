import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Shield, Rocket } from 'lucide-react';
import { billingService } from '@/lib/api';

interface Plan {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
    features: string[];
}

export default function ServicePricing() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await billingService.getPlans();
                setPlans(response.data);
            } catch (error) {
                console.error("Failed to fetch plans:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleSubscribe = async (planId: string) => {
        try {
            await billingService.subscribe(planId);
            alert(`You have successfully switched to the ${planId} plan.`);
        } catch (error) {
            alert("There was an error updating your subscription.");
        }
    };

    const getIcon = (name: string) => {
        if (name === 'Enterprise') return <Crown className="h-6 w-6 text-amber-500" />;
        if (name === 'Unlimited') return <Zap className="h-6 w-6 text-indigo-500" />;
        if (name === 'Professional') return <Rocket className="h-6 w-6 text-blue-500" />;
        return <Shield className="h-6 w-6 text-slate-400" />;
    };

    if (loading) return <div>Loading plans...</div>;

    return (
        <div className="space-y-8 py-8 px-4 max-w-7xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Service Pricing & Plans
                </h1>
                <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
                    Scale your security operations with our flexible multi-tenant plans.
                    Choose the power level that fits your infrastructure requirements.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                    <Card key={plan.id} className={`flex flex-col relative overflow-hidden transition-all hover:shadow-lg border-2 ${plan.id === 'enterprise' ? 'border-primary shadow-md' : 'border-border'
                        }`}>
                        {plan.id === 'enterprise' && (
                            <div className="absolute top-0 right-0">
                                <Badge className="rounded-none rounded-bl-lg px-3 py-1 bg-primary text-primary-foreground font-semibold">
                                    MOST POPULAR
                                </Badge>
                            </div>
                        )}
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                {getIcon(plan.name)}
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                            </div>
                            <div className="flex items-baseline gap-1 mt-4">
                                <span className="text-4xl font-bold">${plan.price}</span>
                                <span className="text-muted-foreground">/{plan.interval}</span>
                            </div>
                            <CardDescription className="mt-2">
                                For infrastructures up to {plan.id === 'unlimited' ? '∞' : plan.id === 'enterprise' ? '500' : plan.id === 'professional' ? '50' : '5'} agents.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 text-sm">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full font-bold h-11 transition-all"
                                variant={plan.id === 'enterprise' ? 'default' : 'outline'}
                                onClick={() => handleSubscribe(plan.id)}
                            >
                                {plan.id === 'enterprise' ? 'Upgrade Now' : 'Select Plan'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Card className="bg-slate-900 text-slate-50 border-none">
                <CardContent className="flex flex-col md:flex-row items-center justify-between p-8 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">Need a custom solution?</h3>
                        <p className="text-slate-400">
                            We offer custom pricing for large-scale deployments and specialized security requirements.
                        </p>
                    </div>
                    <Button variant="outline" className="bg-transparent border-slate-700 hover:bg-slate-800 text-white min-w-[200px] h-12">
                        Contact Sales
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
