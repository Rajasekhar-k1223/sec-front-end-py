import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { CheckSquare, Clock, Plus, Filter } from 'lucide-react';
import { tasksService } from '@/lib/api';

interface Task {
    id: string;
    title: string;
    priority: string;
    due: string;
    status: string;
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', priority: 'Medium', due: 'Today', status: 'Pending' });

    const fetchTasks = async () => {
        try {
            const response = await tasksService.getTasks();
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreate = async () => {
        try {
            await tasksService.createTask({ ...newTask, id: crypto.randomUUID() });
            setOpen(false);
            fetchTasks();
            setNewTask({ title: '', priority: 'Medium', due: 'Today', status: 'Pending' });
        } catch (error) {
            console.error("Failed to create task", error);
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">My Tasks</h2>
                    <p className="text-muted-foreground mt-2">Manage your daily security operations tasks.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> New Task</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Task</DialogTitle>
                                <DialogDescription>
                                    Add a new operational task to your queue.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Title</Label>
                                    <Input id="title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="priority" className="text-right">Priority</Label>
                                    <Select onValueChange={(v) => setNewTask({ ...newTask, priority: v })} defaultValue={newTask.priority}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="due" className="text-right">Due</Label>
                                    <Input id="due" value={newTask.due} onChange={(e) => setNewTask({ ...newTask, due: e.target.value })} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleCreate}>Save Task</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4">
                {tasks.map((task) => (
                    <Card key={task.id} className="hover:bg-secondary/50 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${task.priority === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                    <CheckSquare className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{task.title}</h3>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <Clock className="mr-1 h-3 w-3" /> Due: {task.due}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                                    {task.status}
                                </span>
                                <Button variant="ghost" size="sm">View</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
