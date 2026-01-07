import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Activity, Clock, Server, AlertTriangle } from 'lucide-react';
import { tracingService } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface Trace {
    id: string;
    service_name: string;
    operation: string;
    duration: number;
    timestamp: string;
    status: 'success' | 'error';
    spans_count: number;
}

export default function Tracing() {
    const [traces, setTraces] = useState<Trace[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTraces = async () => {
            try {
                const response = await tracingService.getTraces();
                setTraces(response.data);
            } catch (error) {
                console.error("Failed to fetch traces", error);
            }
        };
        fetchTraces();
    }, []);

    const filteredTraces = traces.filter(t =>
        t.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.operation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Distributed Tracing</h2>
                    <p className="text-muted-foreground">Trace requests across microservices.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                </div>
            </div>

            <Card className="border-border bg-card">
                <CardContent className="p-4 flex space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Search by Service or Operation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="rounded-md border border-border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                    <div className="col-span-3">Trace ID / Timestamp</div>
                    <div className="col-span-3">Service & Operation</div>
                    <div className="col-span-2">Duration</div>
                    <div className="col-span-2">Spans</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>

                {filteredTraces.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No traces found.</div>
                ) : (
                    filteredTraces.map((trace) => (
                        <div key={trace.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors cursor-pointer">
                            <div className="col-span-3 flex flex-col">
                                <span className="font-mono text-xs text-primary">{trace.id.substring(0, 8)}...</span>
                                <span className="text-xs text-muted-foreground">{new Date(trace.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className="col-span-3 flex flex-col">
                                <span className="font-semibold">{trace.service_name}</span>
                                <span className="text-xs text-muted-foreground">{trace.operation}</span>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                {trace.duration}ms
                            </div>
                            <div className="col-span-2 text-muted-foreground">
                                {trace.spans_count} spans
                            </div>
                            <div className="col-span-2 text-right">
                                <Badge variant={trace.status === 'error' ? 'destructive' : 'default'} className={
                                    trace.status === 'success' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : ''
                                }>
                                    {trace.status}
                                </Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
