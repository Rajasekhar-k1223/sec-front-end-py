import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Shield, Tag } from 'lucide-react';
import { threatIntelService } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface IOC {
    id: string;
    type: string;
    value: string;
    confidence: number;
    source: string;
    tags: string[];
    date_added: string;
}

export default function ThreatIntel() {
    const [iocs, setIocs] = useState<IOC[]>([]);

    useEffect(() => {
        const fetchIocs = async () => {
            try {
                const response = await threatIntelService.getIOCs();
                setIocs(response.data);
            } catch (error) {
                console.error("Failed to fetch IOCs", error);
            }
        };
        fetchIocs();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Threat Intelligence</h2>
                    <p className="text-muted-foreground">Manage IOCs and external threat feeds.</p>
                </div>
                <div className="flex space-x-2">
                    <Button>+ Add IOC</Button>
                </div>
            </div>

            <div className="rounded-md border border-border">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/20 font-medium text-sm text-muted-foreground">
                    <div className="col-span-2">Type</div>
                    <div className="col-span-3">Value</div>
                    <div className="col-span-2">Confidence</div>
                    <div className="col-span-2">Source</div>
                    <div className="col-span-3">Tags</div>
                </div>

                {iocs.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">Loading IOCs...</div>
                ) : (
                    iocs.map((ioc) => (
                        <div key={ioc.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/10 items-center text-sm transition-colors">
                            <div className="col-span-2 capitalize flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span>{ioc.type.replace('_', ' ')}</span>
                            </div>
                            <div className="col-span-3 font-mono text-xs truncate bg-secondary px-1 rounded" title={ioc.value}>
                                {ioc.value}
                            </div>
                            <div className="col-span-2 text-muted-foreground">
                                <span className={`font-bold ${ioc.confidence > 90 ? 'text-red-500' : 'text-yellow-500'}`}>
                                    {ioc.confidence}%
                                </span>
                            </div>
                            <div className="col-span-2 text-muted-foreground">{ioc.source}</div>
                            <div className="col-span-3 flex flex-wrap gap-1">
                                {ioc.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
