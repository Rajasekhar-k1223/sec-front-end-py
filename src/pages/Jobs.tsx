import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause, RefreshCw, Briefcase } from 'lucide-react';
import { jobsService } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface Job {
    id: string;
    name: string;
    schedule: string;
    last_run: string;
    next_run: string;
    status: 'active' | 'paused' | 'error';
}

export default function Jobs() {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await jobsService.getJobs();
                setJobs(response.data);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Job Orchestration</h2>
                    <p className="text-muted-foreground">Manage scheduled tasks and automated workflows.</p>
                </div>
                <div className="flex space-x-2">
                    <Button>+ Schedule Job</Button>
                </div>
            </div>

            <div className="rounded-md border border-border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                    <div className="col-span-4">Job Name</div>
                    <div className="col-span-2">Schedule (Cron)</div>
                    <div className="col-span-2">Last Run</div>
                    <div className="col-span-2">Next Run</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>

                {jobs.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">Loading jobs...</div>
                ) : (
                    jobs.map((job) => (
                        <div key={job.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors">
                            <div className="col-span-4 font-medium flex items-center space-x-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                <span>{job.name}</span>
                            </div>
                            <div className="col-span-2 font-mono text-xs bg-secondary px-2 py-1 rounded inline-block w-fit">
                                {job.schedule}
                            </div>
                            <div className="col-span-2 text-muted-foreground text-xs">
                                {new Date(job.last_run).toLocaleString()}
                            </div>
                            <div className="col-span-2 text-muted-foreground text-xs">
                                {new Date(job.next_run).toLocaleString()}
                            </div>
                            <div className="col-span-2 text-right flex items-center justify-end space-x-2">
                                <Badge variant="outline" className={
                                    job.status === 'active' ? 'text-green-500 border-green-500/20' : 'text-gray-500 border-gray-500/20'
                                }>
                                    {job.status}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    {job.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
