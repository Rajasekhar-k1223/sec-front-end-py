import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Share2, Network, Cpu, Globe, Zap, Activity } from 'lucide-react';

import { Button } from '@/components/ui/button';
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

interface SwarmMission {
    id: string;
    name: string;
    agents: number;
    consensus: number;
    status: 'Active' | 'Completed' | 'Syncing';
    progress: number;
}

interface SwarmEvent {
    id: string;
    node: string;
    action: string;
    target: string;
    timestamp: string;
}

import { swarmService } from '@/lib/api';

export default function SwarmIntelligence() {
    const [missions, setMissions] = useState<SwarmMission[]>([]);
    const [events, setEvents] = useState<SwarmEvent[]>([]);
    const [open, setOpen] = useState(false);
    const [newMission, setNewMission] = useState({ name: '', agents: 100 });

    const fetchMissions = async () => {
        try {
            const response = await swarmService.getMissions();
            setMissions(response.data);
        } catch (error) {
            console.error("Failed", error);
        }
    };

    const handleCreate = async () => {
        try {
            await swarmService.createMission({
                id: crypto.randomUUID(),
                ...newMission,
                consensus: 0,
                status: 'Syncing',
                progress: 0
            });
            setOpen(false);
            fetchMissions();
            setNewMission({ name: '', agents: 100 });
        } catch (error) {
            console.error("Failed to create mission", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [missRes, evtRes] = await Promise.all([
                    swarmService.getMissions(),
                    swarmService.getEvents()
                ]);
                setMissions(missRes.data);
                setEvents(evtRes.data);
            } catch (error) {
                console.error("Failed", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Swarm Intelligence</h2>
                    <p className="text-muted-foreground">Decentralized agent coordination and collective decision making.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><Share2 className="mr-2 h-4 w-4" /> New Mission</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Deploy Swarm Mission</DialogTitle>
                            <DialogDescription>Dispatch autonomous agents for a coordinated task.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Mission Name</Label>
                                <Input id="name" value={newMission.name} onChange={(e) => setNewMission({ ...newMission, name: e.target.value })} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="agents" className="text-right">Agents</Label>
                                <Input id="agents" type="number" value={newMission.agents} onChange={(e) => setNewMission({ ...newMission, agents: parseInt(e.target.value) })} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate}>Deploy Swarm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Agents Online</CardTitle>
                        <Globe className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,402</div>
                        <p className="text-xs text-muted-foreground">Across 14 Regions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Collective IQ Score</CardTitle>
                        <Zap className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">184</div>
                        <p className="text-xs text-muted-foreground">+12 pts (Last 24h)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Network Efficiency</CardTitle>
                        <Network className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.9%</div>
                        <p className="text-xs text-muted-foreground">Mesh Connectivity</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Share2 className="h-5 w-5 text-indigo-500" />
                            Active Missions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {missions.map((mission) => (
                                <div key={mission.id} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="font-medium flex items-center gap-2">
                                            {mission.name}
                                            <Badge variant={mission.status === 'Active' ? 'default' : 'secondary'} className="text-[10px] h-5">
                                                {mission.status}
                                            </Badge>
                                        </div>
                                        <span className="text-muted-foreground">{mission.agents} Agents</span>
                                    </div>
                                    <Progress value={mission.progress} className="h-2" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Consensus: {mission.consensus}%</span>
                                        <span>{mission.progress}% Complete</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-500" />
                            Live Consensus Log
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {events.map((evt) => (
                                <div key={evt.id} className="flex items-start gap-4 text-sm pb-4 border-b last:border-0 last:pb-0">
                                    <div className="bg-secondary/50 p-2 rounded-full">
                                        <Cpu className="h-4 w-4 text-foreground" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-primary">{evt.action}</span>
                                            <span className="text-xs text-muted-foreground">{evt.timestamp}</span>
                                        </div>
                                        <p className="text-muted-foreground">
                                            <span className="text-foreground font-mono text-xs">{evt.node}</span> → {evt.target}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
