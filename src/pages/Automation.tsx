import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Play, History, Zap, Settings, Shield, AlertCircle, CheckCircle2, XCircle, Terminal, Clock, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function Automation() {
    const [playbooks, setPlaybooks] = useState<any[]>([]);
    const [executions, setExecutions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAll = async () => {
        setIsLoading(true);
        try {
            const [pbRes, execRes] = await Promise.all([
                api.get('/soar/playbooks'),
                api.get('/soar/executions')
            ]);
            setPlaybooks(pbRes.data);
            setExecutions(execRes.data);
        } catch (error) {
            console.error("Failed to fetch automation data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const runPlaybook = async (id: string) => {
        try {
            await api.post(`/soar/run/${id}`);
            fetchAll(); // Refresh history
        } catch (error) {
            console.error("Failed to run playbook", error);
        }
    };

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPlaybook, setNewPlaybook] = useState({ name: '', trigger: '', steps: [] as any[] });
    const [stepAction, setStepAction] = useState('email');
    const [stepParam, setStepParam] = useState('');

    const addStep = () => {
        setNewPlaybook(prev => ({
            ...prev,
            steps: [...prev.steps, { action: stepAction, params: { value: stepParam } }]
        }));
        setStepParam('');
    };

    const handleCreate = async () => {
        try {
            await api.post('/soar/playbooks', newPlaybook);
            setShowCreateModal(false);
            fetchAll();
        } catch (error) {
            console.error("Failed to create", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {showCreateModal && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg shadow-2xl">
                        <CardHeader>
                            <CardTitle>Create Playbook</CardTitle>
                            <CardDescription>Define automated steps.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Name</label>
                                <input
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newPlaybook.name}
                                    onChange={e => setNewPlaybook({ ...newPlaybook, name: e.target.value })}
                                    placeholder="e.g. Block Malicious IP"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Trigger</label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={newPlaybook.trigger}
                                    onChange={e => setNewPlaybook({ ...newPlaybook, trigger: e.target.value })}
                                >
                                    <option value="">Select Trigger...</option>
                                    <option value="alert_created">Alert Created</option>
                                    <option value="schedule">Schedule</option>
                                    <option value="manual">Manual</option>
                                </select>
                            </div>

                            <div className="border rounded-md p-3 space-y-3">
                                <h4 className="text-sm font-medium">Steps</h4>
                                <div className="space-y-2">
                                    {newPlaybook.steps.map((s, i) => (
                                        <div key={i} className="text-xs bg-secondary p-2 rounded flex justify-between">
                                            <span>{i + 1}. {s.action} ({s.params.value})</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        className="h-8 rounded-md border border-input bg-transparent text-xs"
                                        value={stepAction}
                                        onChange={e => setStepAction(e.target.value)}
                                    >
                                        <option value="email">Send Email</option>
                                        <option value="block_ip">Block IP</option>
                                        <option value="isolate_agent">Isolate Agent</option>
                                        <option value="slack">Slack Notification</option>
                                    </select>
                                    <input
                                        className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs"
                                        placeholder="Parameter (e.g. admin@sec.com)"
                                        value={stepParam}
                                        onChange={e => setStepParam(e.target.value)}
                                    />
                                    <Button size="sm" variant="secondary" onClick={addStep}>Add</Button>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                <Button onClick={handleCreate}>Save Playbook</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                        <Bot className="mr-3 h-8 w-8 text-primary" />
                        Automation Hub
                    </h2>
                    <p className="text-muted-foreground">Orchestrate automated responses and security playbooks.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Workflow Settings</Button>
                    <Button onClick={() => setShowCreateModal(true)}><Zap className="mr-2 h-4 w-4" /> Create Playbook</Button>
                </div>
            </div>

            <Tabs defaultValue="playbooks" className="w-full">
                <TabsList className="bg-secondary/20 p-1 mb-6">
                    <TabsTrigger value="playbooks" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                        <Shield className="mr-2 h-4 w-4" /> Active Playbooks
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                        <History className="mr-2 h-4 w-4" /> Execution History
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="playbooks" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {playbooks.map((pb) => (
                            <Card key={pb.id} className="border-border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 group">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <Zap className="h-5 w-5 text-primary" />
                                        </div>
                                        <Badge variant={pb.is_active ? "default" : "secondary"}>
                                            {pb.is_active ? "Active" : "Paused"}
                                        </Badge>
                                    </div>
                                    <CardTitle className="mt-4">{pb.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        Trigger: <code className="text-xs bg-secondary px-1 rounded">{pb.trigger}</code>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {pb.steps?.length || 0} step(s)
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => runPlaybook(pb.id)}
                                        >
                                            <Play className="mr-2 h-3 w-3 fill-current" /> Run Now
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Execution Logs</CardTitle>
                            <CardDescription>Real-time audit of all automated security actions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {executions.map((exec) => (
                                    <div
                                        key={exec.id}
                                        className="flex items-center p-4 rounded-xl border border-border/50 bg-secondary/5 hover:bg-secondary/10 transition-colors"
                                    >
                                        <div className="mr-4">
                                            {exec.status === 'completed' ? (
                                                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-semibold truncate capitalize">
                                                    {playbooks.find(p => p.id === exec.playbook_id)?.name || 'Unknown Playbook'}
                                                </p>
                                                <Badge variant="outline" className="text-[10px] h-4 uppercase tracking-tighter">
                                                    Agent-SOAR
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center">
                                                <Terminal className="mr-1 h-3 w-3" /> {exec.result_log}
                                            </p>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <p className="text-xs font-mono text-muted-foreground">
                                                {new Date(exec.executed_at).toLocaleTimeString()}
                                            </p>
                                            <Button variant="ghost" size="sm" className="h-8 mt-1 px-2">
                                                Details <ChevronRight className="ml-1 h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
