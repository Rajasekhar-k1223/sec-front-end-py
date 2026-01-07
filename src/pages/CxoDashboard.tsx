import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    TrendingUp,
    ShieldCheck,
    Activity,
    DollarSign,
    Globe,
    Award,
    Briefcase,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Target,
    Bug,
    Users,
    AlertCircle
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// Mock Data for Executive View
const riskTrendData = [
    { month: 'Jan', risk: 65, investment: 40 },
    { month: 'Feb', risk: 58, investment: 45 },
    { month: 'Mar', risk: 45, investment: 48 },
    { month: 'Apr', risk: 40, investment: 55 },
    { month: 'May', risk: 35, investment: 60 },
    { month: 'Jun', risk: 25, investment: 75 },
];

const complianceData = [
    { name: 'SOC2', score: 92, fill: '#8b5cf6' },
    { name: 'ISO 27001', score: 85, fill: '#3b82f6' },
    { name: 'GDPR', score: 88, fill: '#10b981' },
    { name: 'HIPAA', score: 78, fill: '#f59e0b' },
];

const budgetData = [
    { name: 'Protection', value: 45, color: '#3b82f6' },
    { name: 'Detection', value: 30, color: '#8b5cf6' },
    { name: 'Response', value: 15, color: '#10b981' },
    { name: 'Governance', value: 10, color: '#f59e0b' },
];

export default function CxoDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Executive Insights</h2>
                    <p className="text-muted-foreground">Strategic overview of security posture, risk, and ROI.</p>
                </div>
                <div className="flex space-x-2">
                    <select className="h-9 w-[180px] rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        <option className="bg-background text-foreground">Last Quarter (Q4)</option>
                        <option className="bg-background text-foreground">Year to Date (YTD)</option>
                        <option className="bg-background text-foreground">Last 30 Days</option>
                    </select>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
                    <Button>Briefing Mode</Button>
                </div>
            </div>

            {/* Top Level KPI Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                        <Award className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-500">A+ (94)</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                            <span className="text-green-500 font-medium">4%</span>
                            <span className="ml-1">vs last quarter</span>
                        </p>
                        <Progress value={94} className="mt-3 h-1 bg-indigo-500/20" indicatorClassName="bg-indigo-500" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Est. Risk Reduction</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$2.4M</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <span className="text-muted-foreground">Potential loss avoided this year</span>
                        </p>
                        <div className="mt-3 text-xs text-muted-foreground">
                            Top threat: <span className="font-medium text-foreground">Ransomware</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                        <Briefcase className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89%</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                            <span className="text-green-500 font-medium">12%</span>
                            <span className="ml-1">improvement</span>
                        </p>
                        <div className="mt-3 grid grid-cols-4 gap-1 h-1">
                            <div className="bg-blue-500 rounded-full"></div>
                            <div className="bg-blue-500 rounded-full"></div>
                            <div className="bg-blue-500 rounded-full"></div>
                            <div className="bg-blue-500/30 rounded-full"></div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">SecOps Efficiency</CardTitle>
                        <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">14m</div>
                        <p className="text-xs text-muted-foreground mt-1">Mean Time to Remediate (MTTR)</p>
                        <p className="text-xs text-muted-foreground flex items-center mt-2">
                            <ArrowDownRight className="h-3 w-3 mr-1 text-green-500" />
                            <span className="text-green-500 font-medium">25%</span>
                            <span className="ml-1">faster than industry avg</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Risk Trend Chart */}
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Risk vs. Investment</CardTitle>
                        <CardDescription>Correlation between security spend and risk index reduction.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={riskTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Line type="monotone" dataKey="risk" name="Risk Index" stroke="#ef4444" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="investment" name="Protection Level" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Compliance & Budget */}
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Compliance Frameworks</CardTitle>
                        <CardDescription>Readiness across key standards.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {complianceData.map((item) => (
                                <div key={item.name} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-muted-foreground">{item.score}%</span>
                                    </div>
                                    <Progress value={item.score} className="h-2" style={{ backgroundColor: `${item.fill}20` }} indicatorClassName={`bg-[${item.fill}]`} />
                                    {/* Note: Inlines styles for indicatorClassName are tricky in Tailwind, using simpler aproach below */}
                                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                        <div className="h-full rounded-full transition-all" style={{ width: `${item.score}%`, backgroundColor: item.fill }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-border">
                            <h4 className="font-medium text-sm mb-4">Budget Allocation</h4>
                            <div className="flex items-center space-x-2 h-4 rounded-full overflow-hidden">
                                {budgetData.map((item) => (
                                    <div key={item.name} style={{ width: `${item.value}%`, backgroundColor: item.color }} title={`${item.name}: ${item.value}%`}></div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-4 mt-3">
                                {budgetData.map((item) => (
                                    <div key={item.name} className="flex items-center text-xs text-muted-foreground">
                                        <span className="h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: item.color }}></span>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Operational Health Section */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Operational Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Asset Coverage</CardTitle>
                            <Target className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">94%</div>
                            <div className="mt-2 h-2 w-full rounded-full bg-secondary overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '94%' }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                482 / 512 known endpoints protected
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Critical Vuln Aging</CardTitle>
                            <Bug className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-500">4</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                                Vulnerabilities open &gt; 30 days
                            </p>
                            <div className="flex items-center space-x-2 mt-3 text-xs text-muted-foreground">
                                <AlertCircle className="h-3 w-3" />
                                <span>Requires immediate attention</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">User Risk Score</CardTitle>
                            <Users className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                High-risk users identified (Phishing prone)
                            </p>
                            <div className="mt-3 grid grid-cols-7 gap-1">
                                {[...Array(7)].map((_, i) => (
                                    <div key={i} className={`h-6 rounded-sm ${i < 2 ? 'bg-red-500' : 'bg-secondary'}`} title="User Risk Level"></div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <Globe className="h-5 w-5 mr-2" />
                            Global Threat Level
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">MODERATE</div>
                        <p className="text-sm text-muted-foreground mt-2">Elevated activity detected in APAC region targeting Financial services.</p>
                    </CardContent>
                </Card>

                <Card className="bg-secondary/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <DollarSign className="h-5 w-5 mr-2" />
                            Cost Optimization
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">$12,450</div>
                        <p className="text-sm text-muted-foreground mt-2">Monthly savings identified via idle resource termination.</p>
                    </CardContent>
                </Card>

                <Card className="bg-secondary/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <Briefcase className="h-5 w-5 mr-2" />
                            Vendor Risk
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-500">2 Critical</div>
                        <p className="text-sm text-muted-foreground mt-2">3rd party dependencies require immediate patching.</p>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
