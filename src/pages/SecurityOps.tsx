import { useState } from 'react';
import KanbanBoard from '@/components/soar/KanbanBoard';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Settings, Play } from 'lucide-react';
import { incidentsService } from '@/lib/api';

export default function SecurityOps() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [open, setOpen] = useState(false);
    const [newIncident, setNewIncident] = useState({
        title: '',
        impact_level: 'medium',
        status: 'new',
        affected_services: ['Network']
    });

    const handleCreate = async () => {
        try {
            await incidentsService.createIncident({
                ...newIncident,
                timeline: [{ timestamp: new Date().toISOString(), message: 'Incident Reported via Ops Content' }]
            });
            setOpen(false);
            setRefreshTrigger(prev => prev + 1);
            setNewIncident({ title: '', impact_level: 'medium', status: 'new', affected_services: ['Network'] });
        } catch (error) {
            console.error("Failed to create incident", error);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Security Operations</h2>
                    <p className="text-muted-foreground">Incident triage, investigation, and automated response.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Configure Flows</Button>
                    <Button variant="outline"><Play className="mr-2 h-4 w-4" /> Run Playbook</Button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> New Incident</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create Security Incident</DialogTitle>
                                <DialogDescription>
                                    Log a new security event for investigation.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Title</Label>
                                    <Input id="title" value={newIncident.title} onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="severity" className="text-right">Impact</Label>
                                    <Select onValueChange={(v) => setNewIncident({ ...newIncident, impact_level: v })} defaultValue={newIncident.impact_level}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select Impact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate}>Open Incident</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <KanbanBoard refreshTrigger={refreshTrigger} />
            </div>
        </div>
    );
}
