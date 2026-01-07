import { useState, useEffect } from 'react';
import { sustainabilityService } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Wind, Zap, ArrowDown, Server } from 'lucide-react';

interface Recommendation {
    id: string;
    action: string;
    impact: string;
    savings: string;
    difficulty: string;
}

export default function Sustainability() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

    const [stats, setStats] = useState({
        carbon_intensity: "128 gCO2/kWh",
        pue: 1.2,
        green_energy_pct: 85
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await sustainabilityService.getDashboard();
                if (response.data) {
                    setRecommendations(response.data.recommendations);
                    setStats({
                        carbon_intensity: response.data.carbon_intensity,
                        pue: response.data.pue,
                        green_energy_pct: response.data.green_energy_pct
                    });
                }
            } catch (error) {
                console.error("Failed to fetch Sustainability data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Sustainability & Green Ops</h2>
            <p className="text-muted-foreground">Monitor and optimize the carbon footprint of your AI and Cloud infrastructure.</p>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Carbon Intensity</CardTitle>
                        <Leaf className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.carbon_intensity}</div>
                        <p className="text-xs text-muted-foreground">-4% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Energy Efficiency (PUE)</CardTitle>
                        <Zap className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pue}</div>
                        <p className="text-xs text-muted-foreground">Optimal Range</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Green Energy Mix</CardTitle>
                        <Wind className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.green_energy_pct}%</div>
                        <p className="text-xs text-muted-foreground">Renewable Sources</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        Optimization Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border">
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                            <div className="col-span-4">Action</div>
                            <div className="col-span-2">Impact</div>
                            <div className="col-span-3">Est. Savings</div>
                            <div className="col-span-3 text-right">Difficulty</div>
                        </div>
                        {recommendations.map((rec) => (
                            <div key={rec.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors">
                                <div className="col-span-4 font-medium flex items-center gap-2">
                                    <Server className="h-4 w-4 text-muted-foreground" />
                                    {rec.action}
                                </div>
                                <div className="col-span-2">
                                    <Badge variant="outline" className={rec.impact === 'High' ? 'text-green-600 border-green-600' : ''}>
                                        {rec.impact}
                                    </Badge>
                                </div>
                                <div className="col-span-3 flex items-center gap-1 text-green-600 font-mono">
                                    <ArrowDown className="h-3 w-3" />
                                    {rec.savings}
                                </div>
                                <div className="col-span-3 text-right text-muted-foreground">{rec.difficulty}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
